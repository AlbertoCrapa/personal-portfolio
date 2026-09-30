import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { SPRING_SWAP, useReducedMotion } from '../../../utils/motion';

/**
 * AnimatedNumber — fixed-slot digit swap.
 *
 * Each digit owns a slot; only the ones that actually changed roll, so "9 → 10"
 * doesn't re-animate the whole number and a filter counter ticking down reads
 * as a count rather than a re-render. Slots are `tabular-nums`, so the width
 * never jitters between frames.
 */
const AnimatedNumber = ({ value, className = '' }) => {
    const reduce = useReducedMotion();
    const digits = String(value).split('');
    const [direction, setDirection] = React.useState(1);
    const previous = React.useRef(value);

    React.useEffect(() => {
        setDirection(value >= previous.current ? 1 : -1);
        previous.current = value;
    }, [value]);

    if (reduce) {
        return <span className={`tabular-nums ${className}`}>{value}</span>;
    }

    return (
        <span className={`inline-flex tabular-nums ${className}`} aria-label={String(value)}>
            {digits.map((digit, i) => (
                <span
                    key={`${digits.length}-${i}`}
                    aria-hidden="true"
                    className="relative inline-block overflow-hidden"
                    style={{ height: '1em', lineHeight: '1em' }}
                >
                    <AnimatePresence initial={false} mode="popLayout">
                        <motion.span
                            key={digit}
                            initial={{ y: direction * 12, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: direction * -12, opacity: 0 }}
                            transition={SPRING_SWAP}
                            className="inline-block"
                        >
                            {digit}
                        </motion.span>
                    </AnimatePresence>
                </span>
            ))}
        </span>
    );
};

export default AnimatedNumber;
