import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { EASE_OUT, SPRING_PRESS, SPRING_SWAP, useReducedMotion } from '../../../utils/motion';

/**
 * SearchField — text filter with a focus ring that springs and a "/" shortcut.
 *
 * The magnifier leans into the field on focus and the clear button pops in
 * only once there is something to clear, so the control is at its quietest
 * while it is empty — which is most of the time.
 */
const SearchField = ({
    value,
    onChange,
    placeholder = 'Search…',
    label,
    shortcut = '/',
    className = '',
}) => {
    const reduce = useReducedMotion();
    const inputRef = React.useRef(null);
    const [focused, setFocused] = React.useState(false);

    // "/" focuses the field from anywhere on the page, unless the visitor is
    // already typing into something else.
    React.useEffect(() => {
        if (!shortcut) return undefined;
        const onKeyDown = (event) => {
            if (event.key !== shortcut || event.metaKey || event.ctrlKey || event.altKey) return;
            const tag = document.activeElement?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
            event.preventDefault();
            inputRef.current?.focus();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [shortcut]);

    return (
        <div className={className}>
            {label && (
                <span className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
                    {label}
                </span>
            )}

            <motion.div
                animate={{
                    borderColor: focused
                        ? 'rgb(var(--rgb-border-strong))'
                        : 'rgb(var(--rgb-border))',
                }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="relative flex h-11 items-center gap-2 rounded-xl border bg-surface px-3 has-[input:focus-visible]:outline has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-accent-blue"
            >
                <motion.svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="h-4 w-4 flex-shrink-0 text-text-muted"
                    animate={reduce ? undefined : { scale: focused ? 1.08 : 1 }}
                    transition={SPRING_SWAP}
                >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                </motion.svg>

                <input
                    ref={inputRef}
                    type="search"
                    value={value}
                    placeholder={placeholder}
                    onChange={(event) => onChange?.(event.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onKeyDown={(event) => {
                        if (event.key === 'Escape') {
                            onChange?.('');
                            event.currentTarget.blur();
                        }
                    }}
                    className="min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none focus-visible:outline-none placeholder:text-text-muted [&::-webkit-search-cancel-button]:hidden"
                />

                <AnimatePresence initial={false}>
                    {value ? (
                        <motion.button
                            key="clear"
                            type="button"
                            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
                            whileTap={reduce ? undefined : { scale: 0.88 }}
                            transition={SPRING_PRESS}
                            onClick={() => {
                                onChange?.('');
                                inputRef.current?.focus();
                            }}
                            aria-label="Clear search"
                            className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-md text-text-muted hover:bg-surface-hover hover:text-text-primary"
                        >
                            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                                <path d="M6 6l12 12M6 18L18 6" />
                            </svg>
                        </motion.button>
                    ) : (
                        shortcut && (
                            <motion.kbd
                                key="shortcut"
                                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                                animate={{ opacity: focused ? 0 : 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={SPRING_PRESS}
                                aria-hidden="true"
                                className="hidden flex-shrink-0 rounded border border-border bg-bg px-1.5 py-0.5 font-sans text-[0.65rem] font-semibold text-text-muted sm:block"
                            >
                                {shortcut}
                            </motion.kbd>
                        )
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default SearchField;
