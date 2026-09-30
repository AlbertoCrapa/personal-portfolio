import React from 'react';
import { motion } from 'framer-motion';

import {
    EASE_OUT,
    SPRING_BOUNCE_CLOSE,
    SPRING_BOUNCE_ICON,
    SPRING_BOUNCE_OPEN,
    SPRING_BOUNCE_ROW,
    useReducedMotion,
} from '../../../utils/motion';

/**
 * BouncyAccordion
 *
 * Rows behave like a stack of cards rather than a list of dividers: closed
 * neighbours sit flush and share their corner radius, and opening one pushes
 * itself out of the stack — gaining a gap and its own full radius — while the
 * panel springs open with real overshoot.
 *
 * Height is measured, never animated to `auto`: a ResizeObserver keeps the
 * target in sync so content that reflows (an image loading, a font swapping)
 * doesn't leave the panel clipped.
 *
 * Props:
 *   items         – [{ id, title, meta?, content }]
 *   allowMultiple – keep every opened row open (default: one at a time)
 *   defaultOpenId – row open on first render
 */

const RADIUS_GROUPED = 8;
const RADIUS_SEPARATE = 16;
const GROUP_GAP = 12;

const Chevron = ({ open, reduce }) => (
    <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 flex-shrink-0 text-text-muted"
        animate={{ rotate: open ? 180 : 0 }}
        transition={reduce ? { duration: 0 } : SPRING_BOUNCE_ICON}
    >
        <path d="m6 9 6 6 6-6" />
    </motion.svg>
);

const AccordionRow = ({ item, open, onToggle, marginTop, startsGroup, endsGroup, reduce }) => {
    const contentRef = React.useRef(null);
    const [height, setHeight] = React.useState(0);

    React.useLayoutEffect(() => {
        const el = contentRef.current;
        if (!el) return undefined;
        const measure = () => setHeight(el.scrollHeight);
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, [item.content]);

    const panelId = `accordion-panel-${item.id}`;
    const buttonId = `accordion-button-${item.id}`;

    return (
        <motion.div
            // No `layout` here on purpose: the measured height animation
            // already carries the siblings, and a layout projection on top of
            // an animated marginTop double-drives the same pixels.
            transition={reduce ? { duration: 0 } : SPRING_BOUNCE_ROW}
            animate={{
                marginTop,
                borderTopLeftRadius: startsGroup ? RADIUS_SEPARATE : RADIUS_GROUPED,
                borderTopRightRadius: startsGroup ? RADIUS_SEPARATE : RADIUS_GROUPED,
                borderBottomLeftRadius: endsGroup ? RADIUS_SEPARATE : RADIUS_GROUPED,
                borderBottomRightRadius: endsGroup ? RADIUS_SEPARATE : RADIUS_GROUPED,
            }}
            className="relative overflow-hidden border border-border bg-surface"
            style={{ backgroundColor: open ? 'rgb(var(--rgb-surface-hover))' : undefined }}
        >
            <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={onToggle}
                className="flex w-full items-center gap-4 px-4 py-3.5 text-left sm:px-5"
            >
                <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-text-primary sm:text-base">
                        {item.title}
                    </span>
                    {item.meta && (
                        <span className="mt-0.5 block text-xs text-text-muted">{item.meta}</span>
                    )}
                </span>
                <Chevron open={open} reduce={reduce} />
            </button>

            <motion.div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                aria-hidden={!open}
                initial={false}
                animate={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
                transition={
                    reduce
                        ? { duration: 0 }
                        : {
                            height: open ? SPRING_BOUNCE_OPEN : SPRING_BOUNCE_CLOSE,
                            opacity: { duration: open ? 0.26 : 0.16, ease: EASE_OUT },
                        }
                }
                className="overflow-hidden"
            >
                <div ref={contentRef} className="px-4 pb-5 pt-1 sm:px-5">
                    {item.content}
                </div>
            </motion.div>
        </motion.div>
    );
};

const BouncyAccordion = ({ items = [], allowMultiple = false, defaultOpenId = null, className = '' }) => {
    const reduce = useReducedMotion();
    const [openIds, setOpenIds] = React.useState(() => (defaultOpenId ? [defaultOpenId] : []));

    const toggle = (id) => {
        setOpenIds((current) => {
            const isOpen = current.includes(id);
            if (allowMultiple) {
                return isOpen ? current.filter((x) => x !== id) : [...current, id];
            }
            return isOpen ? [] : [id];
        });
    };

    if (!items.length) return null;

    return (
        <div className={className}>
            {items.map((item, i) => {
                const open = openIds.includes(item.id);
                const prevOpen = i > 0 && openIds.includes(items[i - 1].id);
                const nextOpen = i < items.length - 1 && openIds.includes(items[i + 1].id);
                return (
                    <AccordionRow
                        key={item.id}
                        item={item}
                        open={open}
                        reduce={reduce}
                        onToggle={() => toggle(item.id)}
                        // -1 collapses the shared edge of two flush rows into a
                        // single hairline instead of stacking both borders.
                        marginTop={i === 0 ? 0 : open || prevOpen ? GROUP_GAP : -1}
                        startsGroup={i === 0 || open || prevOpen}
                        endsGroup={i === items.length - 1 || open || nextOpen}
                    />
                );
            })}
        </div>
    );
};

export default BouncyAccordion;
