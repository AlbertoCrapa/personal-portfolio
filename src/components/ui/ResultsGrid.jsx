import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SearchX } from 'lucide-react';

import { motionTokens } from '../arc/lib/motion-tokens';
import { Button } from '../arc/button/button';
import { EmptyState } from '../arc/empty-state/empty-state';
import styles from './ResultsGrid.module.css';

/**
 * ResultsGrid — the body of a filtered listing.
 *
 * Items keep their key and carry `layout`, so when a filter changes the
 * survivors glide to their new cells on Arc's smooth spring instead of the
 * grid being rebuilt: you can see which items stayed. Leaving items fade out
 * faster than new ones arrive.
 *
 * Props:
 *   items                   – already filtered and sorted
 *   view                    – 'grid' | 'list'
 *   renderCard / renderRow  – per-view renderers
 *   keyField                – stable identity (default `slug`)
 *   empty                   – { title, description } for when nothing matches
 *   onReset                 – the one next step from the empty state
 */
const { duration, ease, spring } = motionTokens;

const ResultsGrid = ({ items = [], view = 'grid', renderCard, renderRow, keyField = 'slug', empty, onReset }) => {
    const reduce = useReducedMotion();
    const isList = view === 'list' && typeof renderRow === 'function';

    if (!items.length) {
        return (
            <EmptyState
                title={empty?.title || 'Nothing matches these filters'}
                description={empty?.description || 'Try fewer filters or a shorter search.'}
                icon={<SearchX size={20} strokeWidth={1.75} />}
                action={onReset ? <Button onClick={onReset}>Clear filters</Button> : undefined}
            />
        );
    }

    return (
        <ul className={isList ? styles.list : styles.grid}>
            <AnimatePresence mode="popLayout" initial={false}>
                {items.map((item, index) => (
                    <motion.li
                        key={item[keyField] || index}
                        layout={reduce ? false : 'position'}
                        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, transition: { duration: duration.exit, ease: [...ease.exit] } }}
                        transition={reduce ? { duration: 0 } : { ...spring.smooth, opacity: { duration: duration.standard, ease: [...ease.enter] } }}
                        className={styles.item}
                    >
                        {isList ? renderRow(item) : renderCard(item)}
                    </motion.li>
                ))}
            </AnimatePresence>
        </ul>
    );
};

export default ResultsGrid;
