import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import {
    EASE_OUT,
    SPRING_LAYOUT,
    SPRING_PRESS,
    SPRING_SURFACE,
    SPRING_SWAP,
    useReducedMotion,
} from '../../../utils/motion';

/**
 * MultiSelect — searchable combobox that keeps every choice visible as a chip.
 *
 * Three things carry the interaction:
 *   • the panel morphs out of the field it belongs to rather than appearing
 *     next to it, so the connection is never in doubt;
 *   • chips enter and leave under `popLayout`, so the ones that stay slide to
 *     their new position instead of teleporting when a neighbour is removed;
 *   • the row a keyboard user is on is the same highlighted row the mouse
 *     produces — one `activeIndex`, two input methods.
 *
 * Props:
 *   options   – [{ value, label, count? }]
 *   selected  – array of selected values (controlled)
 *   onChange  – (nextValues) => void
 *   label     – visible field label
 *   ariaLabel – accessible name when the field has no visible label
 *   placeholder / emptyLabel – copy for the input and the no-results row
 */
const MultiSelect = ({
    options = [],
    selected = [],
    onChange,
    label,
    ariaLabel,
    placeholder = 'Search…',
    emptyLabel = 'No matches',
    className = '',
}) => {
    const reduce = useReducedMotion();
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [activeIndex, setActiveIndex] = React.useState(0);

    const rootRef = React.useRef(null);
    const inputRef = React.useRef(null);
    const listRef = React.useRef(null);
    const listboxId = React.useId();

    const byValue = React.useMemo(
        () => new Map(options.map((option) => [option.value, option])),
        [options],
    );

    const matches = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return options;
        return options.filter((option) => option.label.toLowerCase().includes(q));
    }, [options, query]);

    // A shrinking result list must never leave the highlight past its end.
    React.useEffect(() => {
        setActiveIndex((i) => Math.min(i, Math.max(0, matches.length - 1)));
    }, [matches.length]);

    // Close on an outside press or Escape, wherever focus happens to be.
    React.useEffect(() => {
        if (!open) return undefined;
        const onPointerDown = (event) => {
            if (!rootRef.current?.contains(event.target)) setOpen(false);
        };
        const onKeyDown = (event) => {
            if (event.key === 'Escape') setOpen(false);
        };
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    // Keep the highlighted row inside the scroll port when arrowing past it.
    React.useEffect(() => {
        if (!open) return;
        const row = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
        row?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex, open]);

    const toggleValue = (value) => {
        const next = selected.includes(value)
            ? selected.filter((v) => v !== value)
            : [...selected, value];
        onChange?.(next);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            if (!open) {
                setOpen(true);
                return;
            }
            const step = event.key === 'ArrowDown' ? 1 : -1;
            setActiveIndex((i) => (i + step + matches.length) % Math.max(1, matches.length));
            return;
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            if (!open) {
                setOpen(true);
                return;
            }
            const option = matches[activeIndex];
            if (option) {
                toggleValue(option.value);
                setQuery('');
            }
            return;
        }
        if (event.key === 'Backspace' && !query && selected.length) {
            // Mirrors the way a tag input behaves everywhere else: an empty
            // field plus backspace pops the last chip.
            onChange?.(selected.slice(0, -1));
        }
    };

    return (
        <div ref={rootRef} className={`relative ${className}`}>
            {label && (
                <span className="mb-1.5 block text-xs font-semibold lowercase text-text-muted">
                    {label}
                </span>
            )}

            <motion.div
                layout={reduce ? false : true}
                transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                onClick={() => {
                    setOpen(true);
                    inputRef.current?.focus();
                }}
                className={`flex min-h-[2.75rem] w-full cursor-text flex-wrap items-center gap-1.5 rounded-xl border bg-surface px-2.5 py-2 transition-colors has-[input:focus-visible]:outline has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-accent-blue ${open ? 'border-border-strong' : 'border-border hover:border-border-strong'
                    }`}
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    {selected.map((value) => {
                        const option = byValue.get(value);
                        if (!option) return null;
                        return (
                            <motion.button
                                key={value}
                                type="button"
                                layout={!reduce}
                                initial={reduce ? false : { opacity: 0, scale: 0.8, y: 4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.78, filter: 'blur(2px)' }}
                                transition={
                                    reduce
                                        ? { duration: 0 }
                                        : {
                                            layout: SPRING_LAYOUT,
                                            opacity: { duration: 0.18, ease: EASE_OUT },
                                            default: SPRING_SWAP,
                                        }
                                }
                                onClick={(event) => {
                                    event.stopPropagation();
                                    toggleValue(value);
                                }}
                                className="group inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-bg py-1 pl-2.5 pr-1.5 text-xs font-medium text-text-primary"
                            >
                                {option.label}
                                <span
                                    aria-hidden="true"
                                    className="grid h-4 w-4 place-items-center rounded text-text-muted transition-colors group-hover:bg-surface-hover group-hover:text-text-primary"
                                >
                                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                                        <path d="M6 6l12 12M6 18L18 6" />
                                    </svg>
                                </span>
                                <span className="sr-only">Remove {option.label}</span>
                            </motion.button>
                        );
                    })}
                </AnimatePresence>

                <input
                    ref={inputRef}
                    type="text"
                    role="combobox"
                    aria-label={label ? undefined : ariaLabel}
                    aria-expanded={open}
                    aria-controls={listboxId}
                    aria-autocomplete="list"
                    value={query}
                    placeholder={selected.length ? '' : placeholder}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="min-w-[6rem] flex-1 bg-transparent px-1 text-sm text-text-primary outline-none focus-visible:outline-none placeholder:text-text-muted"
                />

                {selected.length > 0 && (
                    <motion.button
                        type="button"
                        whileTap={reduce ? undefined : { scale: 0.9 }}
                        transition={SPRING_PRESS}
                        onClick={(event) => {
                            event.stopPropagation();
                            onChange?.([]);
                            setQuery('');
                        }}
                        className="ml-auto rounded-md px-1.5 py-0.5 text-xs font-semibold lowercase text-text-muted hover:text-text-primary"
                    >
                        Clear
                    </motion.button>
                )}
            </motion.div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        // Grows out of the field, then settles — the "surface
                        // morph" from the beUI combobox.
                        initial={reduce ? { opacity: 0 } : { opacity: 0, scaleY: 0.86, y: -6 }}
                        animate={{ opacity: 1, scaleY: 1, y: 0 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, scaleY: 0.92, y: -4 }}
                        transition={reduce ? { duration: 0.1 } : SPRING_SURFACE}
                        style={{ transformOrigin: 'top center' }}
                        className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-40 overflow-hidden rounded-xl border border-border-strong shadow-[var(--overlay-shadow)] backdrop-blur-md"
                    >
                        <ul
                            ref={listRef}
                            id={listboxId}
                            role="listbox"
                            aria-multiselectable="true"
                            className="max-h-64 overflow-y-auto bg-[var(--overlay-surface)] p-1"
                        >
                            {matches.map((option, i) => {
                                const isSelected = selected.includes(option.value);
                                return (
                                    <li key={option.value}>
                                        <button
                                            type="button"
                                            role="option"
                                            data-index={i}
                                            aria-selected={isSelected}
                                            onMouseEnter={() => setActiveIndex(i)}
                                            onClick={() => {
                                                toggleValue(option.value);
                                                setQuery('');
                                                inputRef.current?.focus();
                                            }}
                                            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${activeIndex === i ? 'bg-surface-hover text-text-primary' : 'text-text-secondary'
                                                }`}
                                        >
                                            <span
                                                className={`grid h-4 w-4 flex-shrink-0 place-items-center rounded border transition-colors ${isSelected
                                                    ? 'border-text-primary bg-text-primary text-bg'
                                                    : 'border-border-strong'
                                                    }`}
                                            >
                                                {isSelected && (
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        className="h-3 w-3"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="3.4"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        {/* Drawn on, not popped in — the tick reads as a
                                                            deliberate mark rather than a state flip. */}
                                                        <motion.path
                                                            d="M20 6 9 17l-5-5"
                                                            initial={reduce ? false : { pathLength: 0 }}
                                                            animate={{ pathLength: 1 }}
                                                            transition={{ duration: 0.22, ease: EASE_OUT }}
                                                        />
                                                    </svg>
                                                )}
                                            </span>
                                            <span className="min-w-0 flex-1 truncate">{option.label}</span>
                                            {typeof option.count === 'number' && (
                                                <span className="flex-shrink-0 text-xs tabular-nums text-text-muted">
                                                    {option.count}
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}

                            {matches.length === 0 && (
                                <li className="px-2.5 py-3 text-sm text-text-muted">{emptyLabel}</li>
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MultiSelect;
