import React from 'react';

import SEO from '../../components/SEO';
import ProjectCard from '../../components/ui/ProjectCard';
import Breadcrumb from '../../components/ui/Breadcrumb';
import PageHeader from '../../components/ui/PageHeader';
import FilterBar from '../../components/ui/FilterBar';
import ResultsGrid from '../../components/ui/ResultsGrid';
import { useCollectionFilter } from '../../hooks/useCollectionFilter';
import projectData from '../../data/projects.json';
import styles from '../pages.module.css';

/**
 * Projects — find a project by stack or category and open it.
 * `?tag=` (from a tag on a project page) arrives already applied.
 */
const TYPE_LABELS = {
    videogame: 'Games',
    boardgame: 'Board games',
    webapp: 'Web and apps',
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

            <div className={styles.stack}>
                <Breadcrumb items={[{ label: 'home', path: '/' }, { label: 'projects', path: '/projects' }]} />

                <PageHeader
                    title="projects"
                    subtitle="Games, apps and client work, each with my role, the stack and what shipped."
                />

                <FilterBar
                    filter={filter}
                    searchLabel="Search projects"
                    searchPlaceholder="Title, role or technology"
                    facetLabel="Stack"
                    noun="project"
                />

                <ResultsGrid
                    items={filter.results}
                    view={filter.view}
                    empty={{
                        title: 'No projects match these filters',
                        description: 'Remove a technology or shorten the search to see more.',
                    }}
                    onReset={filter.reset}
                    renderCard={(project) => <ProjectCard project={project} />}
                    renderRow={(project) => <ProjectCard project={project} size="list" />}
                />
            </div>
        </>
    );
};

export default Projects;
