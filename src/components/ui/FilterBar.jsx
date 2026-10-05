import React from 'react';

import { SearchField } from '../arc/search-field/search-field';
import FacetPicker from './FacetPicker';
import SegmentedControl from '../arc/segmented-control/segmented-control';
import { Switch } from '../arc/switch/switch';
import { Button } from '../arc/button/button';
import styles from './FilterBar.module.css';

/**
 * FilterBar — the controls above a filtered listing, built from Arc parts and
 * driven by a `useCollectionFilter` instance (which also applies `?tag=`).
 *
 * Two compact rows instead of a wall of chips:
 *   1. what you are looking for: a short search field with the tag picker
 *      beside it (type to find one of dozens of tags; picks stack below);
 *   2. how the results are framed: category and featured on the left, sort
 *      and layout on the right.
 * The result count and Clear filters sit under them.
 */
const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'az', label: 'A to Z' },
];

const VIEW_OPTIONS = [
    { value: 'grid', label: 'Grid' },
    { value: 'list', label: 'List' },
];

const FilterBar = ({
    filter,
    searchLabel = 'Search',
    searchPlaceholder,
    facetLabel = 'Stack',
    facetPlaceholder = 'Add a technology',
    highlightLabel = 'Featured only',
    noun = 'result',
    showSort = true,
    showView = true,
}) => {
    const {
        query, setQuery,
        facets, setFacets, facetOptions,
        group, setGroup, groupOptions,
        sort, setSort,
        onlyHighlighted, setOnlyHighlighted, hasHighlight,
        view, setView,
        results, total, isFiltered, reset,
    } = filter;

    const plural = total === 1 ? noun : `${noun}s`;
    const hasFraming = groupOptions.length > 0 || hasHighlight || showSort;

    return (
        <div className={styles.bar}>
            <div className={styles.find}>
                <div className={styles.search}>
                    <SearchField label={searchLabel} placeholder={searchPlaceholder} value={query} onValueChange={setQuery} />
                </div>
                {facetOptions.length > 1 && (
                    <div className={styles.facets}>
                        <FacetPicker
                            label={facetLabel}
                            placeholder={facetPlaceholder}
                            emptyMessage={`No ${facetLabel.toLowerCase()} matches that`}
                            options={facetOptions}
                            value={facets}
                            onValueChange={setFacets}
                        />
                    </div>
                )}
                {showView && (
                    <div className={styles.view}>
                        <SegmentedControl label="Layout" options={VIEW_OPTIONS} value={view} onValueChange={setView} />
                    </div>
                )}
            </div>

            {hasFraming && (
                <div className={styles.frame}>
                    {groupOptions.length > 0 && (
                        <SegmentedControl
                            label="Category"
                            options={groupOptions.map(({ value, label }) => ({ value, label }))}
                            value={group}
                            onValueChange={setGroup}
                        />
                    )}
                    {hasHighlight && (
                        <Switch label={highlightLabel} checked={onlyHighlighted} onCheckedChange={setOnlyHighlighted} />
                    )}
                    {showSort && (
                        <div className={styles.sort}>
                            <SegmentedControl label="Sort order" options={SORT_OPTIONS} value={sort} onValueChange={setSort} />
                        </div>
                    )}
                </div>
            )}

            <div className={styles.summary}>
                <p className={styles.count} aria-live="polite">
                    {isFiltered ? `${results.length} of ${total} ${plural}` : `${total} ${plural}`}
                </p>
                {isFiltered && (
                    <Button variant="ghost" size="sm" onClick={reset}>Clear filters</Button>
                )}
            </div>
        </div>
    );
};

export default FilterBar;
