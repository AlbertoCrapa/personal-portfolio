import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import SearchField from './motion/SearchField';
import MultiSelect from './motion/MultiSelect';
import SegmentedControl from './motion/SegmentedControl';
import AnimatedNumber from './motion/AnimatedNumber';
import Tag from './motion/Tag';
import { EASE_OUT, SPRING_PRESS, useReducedMotion } from '../../utils/motion';

/**
 * FilterBar — the toolbar above a filtered listing.
 *
 * Reads and writes a `useCollectionFilter` instance, so a page only has to
 * decide what its items are and what the facets mean. Controls are ordered by
 * how often they're touched: text first, facets second, the framing controls
 * (category, sort, layout) last.
 */

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'az', label: 'A–Z' },
];

const GridIcon = () => (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
);

const ListIcon = () => (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const VIEW_OPTIONS = [
    { value: 'grid', label: <GridIcon /> },
    { value: 'list', label: <ListIcon /> },
];

const FilterBar = ({
    filter,
    facetLabel = 'Stack',
    facetPlaceholder = 'Filter by technology',
    searchPlaceholder = 'Search…',
    highlightLabel = 'Featured',
    noun = 'result',
    showView = true,
    className = '',
}) => {
    const reduce = useReducedMotion();
    const {
        query, setQuery,
        facets, setFacets, facetOptions,
        group, setGroup, groupOptions,
        sort, setSort,
        onlyHighlighted, setOnlyHighlighted, hasHighlight,
        view, setView,
        results, total, isFiltered, reset,
    } = filter;

    const plural = results.length === 1 ? noun : `${noun}s`;

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex flex-col gap-3 md:flex-row md:items-start">
                <SearchField
                    value={query}
                    onChange={setQuery}
                    placeholder={searchPlaceholder}
                    className="flex-1"
                />
                {facetOptions.length > 1 && (
                    <MultiSelect
                        options={facetOptions}
                        selected={facets}
                        onChange={setFacets}
                        ariaLabel={facetLabel}
                        placeholder={facetPlaceholder}
                        className="w-full md:w-80"
                    />
                )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {groupOptions.length > 0 && (
                    <SegmentedControl
                        label="Category"
                        options={groupOptions}
                        value={group}
                        onChange={setGroup}
                        size="sm"
                    />
                )}

                {hasHighlight && (
                    <Tag
                        selected={onlyHighlighted}
                        onClick={() => setOnlyHighlighted((v) => !v)}
                        className="h-[1.9rem]"
                    >
                        ★ {highlightLabel}
                    </Tag>
                )}

                <div className="ml-auto flex items-center gap-2">
                    <SegmentedControl
                        label="Sort order"
                        options={SORT_OPTIONS}
                        value={sort}
                        onChange={setSort}
                        size="sm"
                    />
                    {showView && (
                        <div className="hidden sm:block">
                            <SegmentedControl
                                label="Layout"
                                options={VIEW_OPTIONS}
                                value={view}
                                onChange={setView}
                                size="sm"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-muted">
                <p>
                    <AnimatedNumber value={results.length} className="font-semibold text-text-primary" />
                    <span> of {total} {plural}</span>
                </p>

                <AnimatePresence initial={false}>
                    {isFiltered && (
                        <motion.button
                            type="button"
                            initial={reduce ? { opacity: 0 } : { opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -6 }}
                            whileTap={reduce ? undefined : { scale: 0.95 }}
                            transition={reduce ? { duration: 0.15 } : { ...SPRING_PRESS, opacity: { duration: 0.18, ease: EASE_OUT } }}
                            onClick={reset}
                            className="rounded-md text-sm font-semibold text-text-secondary underline-offset-4 hover:text-text-primary hover:underline"
                        >
                            Clear filters
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FilterBar;
