import React from 'react';
import { motion } from 'framer-motion';

import { SPRING_LAYOUT, SPRING_PRESS, useReducedMotion } from '../../../utils/motion';

/**
 * SegmentedControl — one-of-n picker with a gliding indicator.
 *
 * The selected pill is a single element moved by `layoutId`, so switching
 * options reads as the indicator travelling rather than one box vanishing and
 * another appearing. That travel is what tells you the options are peers on
 * one axis — which is exactly the claim a segmented control makes.
 *
 * Props:
 *   options – [{ value, label, count? }]
 *   value / onChange – controlled selection
 *   size – 'sm' | 'md'
 */
const SegmentedControl = ({ options = [], value, onChange, label, size = 'md', className = '' }) => {
    const reduce = useReducedMotion();
    const groupId = React.useId();

    const padding = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm';

    return (
        <div
            role="radiogroup"
            aria-label={label}
            className={`inline-flex items-center gap-0.5 rounded-xl border border-border bg-surface p-1 ${className}`}
        >
            {options.map((option) => {
                const selected = option.value === value;
                return (
                    <motion.button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => onChange?.(option.value)}
                        whileTap={reduce ? undefined : { scale: 0.96 }}
                        transition={SPRING_PRESS}
                        className={`relative rounded-lg font-semibold outline-offset-2 transition-colors ${padding} ${selected ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
                            }`}
                    >
                        {selected && (
                            <motion.span
                                layoutId={`${groupId}-segment`}
                                transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                                className="absolute inset-0 rounded-lg border border-border-strong bg-bg"
                            />
                        )}
                        <span className="relative flex items-center gap-1.5 whitespace-nowrap">
                            {option.label}
                            {typeof option.count === 'number' && (
                                <span className="tabular-nums opacity-60">{option.count}</span>
                            )}
                        </span>
                    </motion.button>
                );
            })}
        </div>
    );
};

export default SegmentedControl;
