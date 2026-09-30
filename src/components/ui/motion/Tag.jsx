import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
    EASE_OUT,
    REVEAL_STAGGER,
    SPRING_LAYOUT,
    SPRING_PRESS,
    useReducedMotion,
} from '../../../utils/motion';

/**
 * Tag — the one chip shape on the site.
 *
 * Static by default (a label). Pass `onClick` and it becomes a toggle: the
 * selected fill is a `layoutId`-free colour swap, but the chip itself carries
 * `layout`, so a row of tags re-flows with a spring when one is added or
 * removed rather than snapping.
 *
 * Props:
 *   index    – position, used for the entrance stagger
 *   selected – toggle state (only meaningful with onClick)
 *   count    – trailing number, e.g. how many results carry this tag
 *   to       – makes the chip a router link (e.g. a pre-filtered listing)
 */

const MotionLink = motion.create(Link);
const Tag = ({
    children,
    index = 0,
    selected = false,
    count,
    onClick,
    to,
    className = '',
    ...rest
}) => {
    const reduce = useReducedMotion();
    const interactive = typeof onClick === 'function' || Boolean(to);

    const base =
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs leading-none transition-colors';
    const tone = selected
        ? 'border-text-primary bg-text-primary text-bg font-semibold'
        : `border-border bg-surface text-text-secondary ${interactive ? 'hover:border-border-strong hover:text-text-primary' : ''}`;

    const Component = to ? MotionLink : interactive ? motion.button : motion.span;

    return (
        <Component
            layout={reduce ? false : true}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.88, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={
                reduce
                    ? { duration: 0.2 }
                    : {
                        layout: SPRING_LAYOUT,
                        opacity: { duration: 0.2, ease: EASE_OUT, delay: index * REVEAL_STAGGER * 0.6 },
                        default: { ...SPRING_PRESS, delay: index * REVEAL_STAGGER * 0.6 },
                    }
            }
            whileTap={interactive && !reduce ? { scale: 0.94 } : undefined}
            onClick={onClick}
            to={to}
            aria-pressed={onClick ? selected : undefined}
            type={onClick && !to ? 'button' : undefined}
            className={`${base} ${tone} ${className}`}
            {...rest}
        >
            {children}
            {typeof count === 'number' && (
                <span className={`tabular-nums ${selected ? 'opacity-70' : 'text-text-muted'}`}>
                    {count}
                </span>
            )}
        </Component>
    );
};

export default Tag;
