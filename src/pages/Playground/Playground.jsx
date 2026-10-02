import React, { useEffect } from 'react';

import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProjectCard from '../../components/ui/ProjectCard';
import RevealSection from '../../components/ui/RevealSection';
import PageHeader from '../../components/ui/PageHeader';
import FilterBar from '../../components/ui/FilterBar';
import ResultsGrid from '../../components/ui/ResultsGrid';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useCollectionFilter } from '../../hooks/useCollectionFilter';
import playgroundData from '../../data/playground.json';

/**
 * Playground Page
 * Experimental projects, demos and prototypes.
 *
 * Same engine as /projects, but the toolbar only appears once there are
 * enough experiments for filtering to beat scanning — a search box above four
 * cards is furniture, not a feature.
 */

const FILTER_THRESHOLD = 4;

const Playground = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const items = React.useMemo(() => (playgroundData.playground || []).filter((item) => !item.hidden), []);

    const filter = useCollectionFilter(items, {
        searchFields: (item) => [
            item.title,
            item.shortDescription,
            ...(item.technologies || []),
            ...(item.tags || []),
        ],
        facetField: (item) => item.technologies || [],
        dateField: (item) => item.date,
        titleField: (item) => item.title,
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const showFilters = items.length >= FILTER_THRESHOLD;
    const view = isMobile ? 'list' : filter.view;

    return (
        <>
            <SEO
                title="Playground - Alberto Crapanzano | Experiments & Demos"
                description="Experimental projects, demos, and technical explorations by Alberto Crapanzano. AI, pathfinding, and creative coding experiments."
                keywords="Playground, Experiments, Enemy AI Prototype, Pathfinding, C++, Game Development, Alberto Crapanzano"
                url="/playground"
            />

            <RevealSection>
                <div className="space-y-8">
                    <Breadcrumb
                        items={[
                            { label: 'home', path: '/' },
                            { label: 'playground', path: '/playground' },
                        ]}
                    />

                    <PageHeader
                        title="playground"
                        subtitle="Experimental projects, demos, and technical explorations."
                    />

                    {showFilters && (
                        <FilterBar
                            filter={filter}
                            facetLabel="Stack"
                            facetPlaceholder="Filter by technology"
                            searchPlaceholder="Search experiments…"
                            noun="experiment"
                        />
                    )}

                    <ResultsGrid
                        items={filter.results}
                        view={view}
                        emptyTitle="Experiments coming soon"
                        emptyBody="Nothing matches yet — check back later, or clear the filters."
                        onReset={filter.isFiltered ? filter.reset : undefined}
                        renderCard={(item) => (
                            <ProjectCard project={item} size="medium" basePath="/playground" />
                        )}
                        renderRow={(item) => (
                            <ProjectCard project={item} size="list" basePath="/playground" />
                        )}
                    />
                </div>
            </RevealSection>
        </>
    );
};

export default Playground;
