import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Button from './Button';
import { EASE_OUT, SPRING_LAYOUT, useReducedMotion } from '../../utils/motion';

/**
 * ResultsGrid — the animated body of a filtered listing.
 *
 * Items carry `layout`, so changing a filter moves the survivors to their new
 * cells instead of tearing the grid down and rebuilding it. That continuity is
 * the whole point: you can watch which projects stayed.
 *
 * `popLayout` takes leaving items out of flow immediately, so the ones staying
 * start travelling on the same frame rather than waiting for the exit to end.
 *
 * Props:
 *   items       – already filtered and sorted
 *   view        – 'grid' | 'list'
 *   renderCard / renderRow – per-view renderers
 *   keyField    – stable identity (defaults to `slug`)
 */

const GRID_CLASSES = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3';

const ResultsGrid = ({
    items = [],
    view: requestedView = 'grid',
    renderCard,
    renderRow,
    keyField = 'slug',
    emptyTitle = 'Nothing here',
    emptyBody,
    onReset,
    className = '',
}) => {
    const reduce = useReducedMotion();
    // Deferred so the toggle that was just pressed paints first; swapping every
    // card for a row is a heavy render and would otherwise block that frame.
    const view = React.useDeferredValue(requestedView);
    // Without this every item re-measures its box on *any* re-render (each
    // keystroke in the search field); only order, membership and view move them.
    const layoutKey = `${view}|${items.map((item, index) => item[keyField] || index).join(',')}`;
    const isList = view === 'list' && typeof renderRow === 'function';

    if (!items.length) {
        return (
            <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
                className={`rounded-2xl border border-dashed border-border px-6 py-14 text-center ${className}`}
            >
                <p className="font-display text-lg font-bold text-text-primary">{emptyTitle}</p>
                {emptyBody && <p className="mx-auto mt-1.5 max-w-sm text-sm text-text-secondary">{emptyBody}</p>}
                {onReset && (
                    <div className="mt-5 flex justify-center">
                        <Button variant="secondary" size="sm" onClick={onReset}>
                            Clear filters
                        </Button>
                    </div>
                )}
            </motion.div>
        );
    }

    return (
        <div className={isList ? `divide-y divide-border ${className}` : `${GRID_CLASSES} ${className}`}>
            <AnimatePresence mode="popLayout" initial={false}>
                {items.map((item, index) => (
                    <motion.div
                        key={item[keyField] || index}
                        layout={reduce ? false : true}
                        layoutDependency={layoutKey}
                        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
                        transition={
                            reduce
                                ? { duration: 0.15 }
                                : {
                                    layout: SPRING_LAYOUT,
                                    opacity: { duration: 0.22, ease: EASE_OUT },
                                    default: { ...SPRING_LAYOUT, delay: Math.min(index, 8) * 0.03 },
                                }
                        }
                        // ponytail: permanent compositor layer per item so the
                        // morph never re-rasters mid-flight; toggle it only
                        // while animating if a listing grows past ~50 items.
                        className={`will-change-transform ${isList ? '' : 'h-full'}`}
                    >
                        {isList ? renderRow(item) : renderCard(item)}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ResultsGrid;
