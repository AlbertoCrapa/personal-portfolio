import React from 'react';
import { motion } from 'framer-motion';

import {
    EASE_OUT,
    REVEAL_BLUR,
    REVEAL_DURATION,
    REVEAL_STAGGER,
    REVEAL_Y,
    useReducedMotion,
} from '../../../utils/motion';

/**
 * Reveal — the one scroll entrance used across the site.
 *
 * Replaces the hand-rolled `.homepage-reveal` class + IntersectionObserver
 * pairs that had drifted apart between pages. Opacity, a short lift and a
 * defocus resolve together; under reduced motion only the opacity runs.
 *
 * Props:
 *   index   – position in a list; multiplies the built-in stagger
 *   delay   – extra delay in seconds, added on top of the staggered one
 *   y       – lift distance in px (0 disables)
 *   blur    – defocus in px (0 disables — do this for sections holding video)
 *   amount  – portion of the element that must be visible to fire
 *   once    – replay on every entrance when false
 *   as      – element/component to render ('div' by default)
 */
const Reveal = ({
    children,
    className = '',
    index = 0,
    delay = 0,
    y = REVEAL_Y,
    blur = REVEAL_BLUR,
    amount = 0.15,
    once = true,
    as = 'div',
    ...rest
}) => {
    const reduce = useReducedMotion();
    const Component = motion[as] || motion.div;

    if (reduce) {
        return (
            <Component
                className={className}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once, amount }}
                transition={{ duration: 0.2 }}
                {...rest}
            >
                {children}
            </Component>
        );
    }

    return (
        <Component
            className={className}
            initial={{ opacity: 0, y, filter: blur ? `blur(${blur}px)` : 'blur(0px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once, amount }}
            transition={{
                duration: REVEAL_DURATION,
                ease: EASE_OUT,
                delay: delay + index * REVEAL_STAGGER,
            }}
            {...rest}
        >
            {children}
        </Component>
    );
};

export default Reveal;
