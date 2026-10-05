import React, { useEffect } from 'react';

import SEO from '../../components/SEO';
import ProjectCard from '../../components/ui/ProjectCard';
import Breadcrumb from '../../components/ui/Breadcrumb';
import PageHeader from '../../components/ui/PageHeader';
import FilterBar from '../../components/ui/FilterBar';
import ResultsGrid from '../../components/ui/ResultsGrid';
import { useCollectionFilter } from '../../hooks/useCollectionFilter';
import playgroundData from '../../data/playground.json';
import styles from '../pages.module.css';

/**
 * Playground — experiments and prototypes, most of them playable here.
 *
 * Same engine as /projects. The filters only appear once there are enough
 * experiments for filtering to beat scanning; `?tag=` still applies either way.
 */
const FILTER_THRESHOLD = 4;

const Playground = () => {
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

    return (
        <>
            <SEO
                title="Playground - Alberto Crapanzano | Experiments & Demos"
                description="Experimental projects, demos, and technical explorations by Alberto Crapanzano. AI, pathfinding, and creative coding experiments."
                keywords="Playground, Experiments, Enemy AI Prototype, Pathfinding, C++, Game Development, Alberto Crapanzano"
                url="/playground"
            />

            <div className={styles.stack}>
                <Breadcrumb items={[{ label: 'home', path: '/' }, { label: 'playground', path: '/playground' }]} />

                <PageHeader
                    title="playground"
                    subtitle="Prototypes and experiments. Most of them run right here in the browser."
                />

                {showFilters && (
                    <FilterBar
                        filter={filter}
                        searchLabel="Search experiments"
                        searchPlaceholder="Title or technology"
                        facetLabel="Stack"
                        noun="experiment"
                    />
                )}

                <ResultsGrid
                    items={filter.results}
                    view={showFilters ? filter.view : 'grid'}
                    empty={filter.isFiltered
                        ? { title: 'No experiments match these filters', description: 'Remove a technology or shorten the search to see more.' }
                        : { title: 'No experiments yet', description: 'New prototypes land here as soon as they run in the browser.' }}
                    onReset={filter.isFiltered ? filter.reset : undefined}
                    renderCard={(item) => <ProjectCard project={item} basePath="/playground" />}
                    renderRow={(item) => <ProjectCard project={item} size="list" basePath="/playground" />}
                />
            </div>
        </>
    );
};

export default Playground;
