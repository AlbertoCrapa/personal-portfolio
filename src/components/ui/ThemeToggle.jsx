import React from 'react';
import { motion } from 'framer-motion';

import { useTheme } from './ThemeProvider';
import { SPRING_LAYOUT, SPRING_PRESS, TAP_SCALE, useReducedMotion } from '../../utils/motion';

/**
 * ThemeToggle — a three-slot rectangle switch (light / system / dark).
 *
 * The selected slot is a real element that glides between positions via
 * `layoutId`, so the pill travels rather than blinking from one cell to the
 * next; the palette itself wipes in as a rectangle through the View Transition
 * set up in ThemeProvider.
 *
 * Props:
 *   origin – which edge the palette wipes in from ('top' | 'bottom' | 'left' | 'right')
 */

const SunIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
);

const SystemIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
    </svg>
);

const MoonIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

const OPTIONS = [
    { id: 'light', label: 'Light', Icon: SunIcon },
    { id: 'system', label: 'System', Icon: SystemIcon },
    { id: 'dark', label: 'Dark', Icon: MoonIcon },
];

const ThemeToggle = ({ origin = 'bottom', className = '' }) => {
    const { preference, setPreference } = useTheme();
    const reduce = useReducedMotion();
    const groupId = React.useId();

    return (
        <div
            role="radiogroup"
            aria-label="Colour theme"
            className={`inline-flex items-center gap-0.5 rounded-xl border border-border bg-surface p-1 ${className}`}
        >
            {OPTIONS.map(({ id, label, Icon }) => {
                const selected = preference === id;
                return (
                    <motion.button
                        key={id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        aria-label={`${label} theme`}
                        title={`${label} theme`}
                        onClick={() => setPreference(id, origin)}
                        whileTap={reduce ? undefined : { scale: TAP_SCALE }}
                        transition={SPRING_PRESS}
                        className="relative inline-flex h-7 w-8 items-center justify-center rounded-lg outline-offset-2"
                    >
                        {selected && (
                            <motion.span
                                layoutId={`${groupId}-theme-pill`}
                                transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                                className="absolute inset-0 rounded-lg border border-border-strong bg-bg"
                            />
                        )}
                        <Icon
                            className="relative h-[15px] w-[15px] transition-colors duration-200"
                            style={{
                                color: selected
                                    ? 'var(--color-text-primary)'
                                    : 'var(--color-text-muted)',
                            }}
                        />
                    </motion.button>
                );
            })}
        </div>
    );
};

export default ThemeToggle;
