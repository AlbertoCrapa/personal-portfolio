import React from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import Layout from '../../layouts/Layout';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProjectCard from '../../components/ui/ProjectCard';
import projectData from '../../data/projects.json';

/**
 * Projects List Page
 * Grid view on desktop, list view on mobile
 * Groups projects by category
 */
const Projects = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const projects = Object.values(projectData.projects);

    // Group projects by type/category
    const groupedProjects = projects.reduce((acc, project) => {
        const category = project.type || 'other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(project);
        return acc;
    }, {});

    // Define category display order and labels
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
        <Layout>
            <SEO
                title="Projects - Alberto Crapanzano | Game Developer Portfolio"
                description="Explore my game development projects, freelance work, and personal experiments. Unity, Unreal Engine, and creative development."
                keywords="Game Projects, Unity, Unreal Engine, Game Development, Portfolio, Alberto Crapanzano"
                url="/projects"
            />

            <div className="space-y-8">
                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        { label: 'home', path: '/' },
                        { label: 'projects', path: '/projects' },
                    ]}
                />

                {/* Projects by Category */}
                {orderedCategories.map((category) => (
                    <section key={category} className="space-y-4">
                        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                            - {categoryLabels[category] || category}
                        </h2>

                        {isMobile ? (
                            // Mobile: List View
                            <div className="space-y-2">
                                {groupedProjects[category].map((project) => (
                                    <ProjectCard key={project.slug} project={project} size="list" />
                                ))}
                            </div>
                        ) : (
                            // Desktop: Grid View
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {groupedProjects[category].map((project) => (
                                    <ProjectCard key={project.slug} project={project} size="medium" />
                                ))}
                            </div>
                        )}
                    </section>
                ))}

                {/* Fallback if no categories */}
                {orderedCategories.length === 0 && projects.length > 0 && (
                    <section className="space-y-4">
                        {isMobile ? (
                            <div className="space-y-2">
                                {projects.map((project) => (
                                    <ProjectCard key={project.slug} project={project} size="list" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {projects.map((project) => (
                                    <ProjectCard key={project.slug} project={project} size="medium" />
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </div>
        </Layout>
    );
};

export default Projects;
