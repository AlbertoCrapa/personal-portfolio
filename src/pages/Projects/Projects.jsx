import React from 'react';

import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProjectCard from '../../components/ui/ProjectCard';
import RevealSection from '../../components/ui/RevealSection';
import PageHeader from '../../components/ui/PageHeader';
import FilterBar from '../../components/ui/FilterBar';
import ResultsGrid from '../../components/ui/ResultsGrid';
import { useCollectionFilter } from '../../hooks/useCollectionFilter';
import projectData from '../../data/projects.json';

/**
 * Projects List Page
 *
 * The old page grouped by `project.type` against a label map that no longer
 * matched the data (`game`/`freelance`/`personal` vs the actual `videogame`/
 * `boardgame`/`webapp`), so every project silently fell through to a single
 * ungrouped grid. Categories are now a filter the visitor drives instead of a
 * fixed outline the page imposes — which is what a portfolio of nine-plus
 * projects with overlapping stacks actually needs.
 */

const TYPE_LABELS = {
    videogame: 'Games',
    boardgame: 'Board games',
    webapp: 'Web & apps',
};

const Projects = () => {
    const projects = React.useMemo(() => Object.values(projectData.projects), []);

    const filter = useCollectionFilter(projects, {
        searchFields: (project) => [
            project.title,
            project.shortDescription,
            project.role,
            project.outcome,
            ...(project.technologies || []),
        ],
        facetField: (project) => project.technologies || [],
        groupField: (project) => project.type,
        groupLabels: TYPE_LABELS,
        dateField: (project) => project.date,
        titleField: (project) => project.title,
        highlightField: (project) => project.important || project.favourite,
    });

    return (
        <>
            <SEO
                title="Projects - Alberto Crapanzano | Game Developer Portfolio"
                description="Explore my game development projects, freelance work, and personal experiments. Unity, Unreal Engine, and creative development."
                keywords="Game Projects, Unity, Unreal Engine, Game Development, Portfolio, Alberto Crapanzano"
                url="/projects"
            />

            <RevealSection>
                <div className="space-y-8">
                    <Breadcrumb
                        items={[
                            { label: 'home', path: '/' },
                            { label: 'projects', path: '/projects' },
                        ]}
                    />

                    <PageHeader
                        title="projects"
                        subtitle="Selected work with clear role, stack, and impact. Open any project for technical details, media, and implementation notes."
                    />

                    <FilterBar
                        filter={filter}
                        facetLabel="Stack"
                        facetPlaceholder="Filter by technology"
                        searchPlaceholder="Search projects, roles, tech…"
                        highlightLabel="Featured"
                        noun="project"
                    />

                    <ResultsGrid
                        items={filter.results}
                        view={filter.view}
                        emptyTitle="Nothing matches those filters"
                        emptyBody="Try a broader stack selection, or clear the search."
                        onReset={filter.reset}
                        renderCard={(project) => (
                            <ProjectCard project={project} size="medium" />
                        )}
                        renderRow={(project) => (
                            <ProjectCard project={project} size="list" />
                        )}
                    />
                </div>
            </RevealSection>
        </>
    );
};

export default Projects;
