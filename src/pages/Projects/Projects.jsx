import React from 'react';

import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProjectCard from '../../components/ui/ProjectCard';
import RevealSection from '../../components/ui/RevealSection';
import projectData from '../../data/projects.json';

/**
 * Projects List Page — modern portfolio grid layout
 * Grouped by category, responsive grid
 */
const Projects = () => {
    const projects = Object.values(projectData.projects);

    // Group projects by type/category
    const groupedProjects = projects.reduce((acc, project) => {
        const category = project.type || 'other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(project);
        return acc;
    }, {});

    const categoryLabels = {
        game: 'Games and Game Jams',
        freelance: 'Freelance Work',
        personal: 'Personal Projects',
        other: 'Other Work',
    };

    const orderedCategories = ['game', 'freelance', 'personal', 'other'].filter(
        (cat) => groupedProjects[cat]?.length > 0
    );

    return (
        <>
            <SEO
                title="Projects - Alberto Crapanzano | Game Developer Portfolio"
                description="Explore my game development projects, freelance work, and personal experiments. Unity, Unreal Engine, and creative development."
                keywords="Game Projects, Unity, Unreal Engine, Game Development, Portfolio, Alberto Crapanzano"
                url="/projects"
            />

            <RevealSection>
                <div className="space-y-10">
                    <Breadcrumb
                        items={[
                            { label: 'home', path: '/' },
                            { label: 'projects', path: '/projects' },
                        ]}
                    />

                    <header>
                        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2 lowercase">
                            <span className="text-text-muted mr-2">/</span>
                            projects
                        </h1>
                        <p className="text-text-secondary max-w-2xl">
                            Selected work with clear role, stack, and impact. Open any project for technical details, media, and implementation notes.
                        </p>
                    </header>

                    {/* Projects by Category */}
                    {orderedCategories.map((category) => (
                        <section key={category} className="space-y-5">
                            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border pb-2">
                                {categoryLabels[category] || category}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {groupedProjects[category].map((project) => (
                                    <ProjectCard key={project.slug} project={project} size="medium" />
                                ))}
                            </div>
                        </section>
                    ))}

                    {orderedCategories.length === 0 && projects.length > 0 && (
                        <section>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {projects.map((project) => (
                                    <ProjectCard key={project.slug} project={project} size="medium" />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </RevealSection>
        </>
    );
};

export default Projects;
