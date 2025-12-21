import React, { useEffect } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import Layout from '../../layouts/Layout';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProjectCard from '../../components/ui/ProjectCard';
import playgroundData from '../../data/playground.json';

/**
 * Playground Page
 * Displays experimental projects and demos
 */
const Playground = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const items = playgroundData.playground || [];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            <SEO
                title="Playground - Alberto Crapanzano | Experiments & Demos"
                description="Experimental projects, demos, and technical explorations by Alberto Crapanzano. AI, pathfinding, and creative coding experiments."
                keywords="Playground, Experiments, AI Demo, Pathfinding, C++, Game Development, Alberto Crapanzano"
                url="/playground"
            />

            <div className="space-y-6">
                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        { label: 'home', path: '/' },
                        { label: 'playground', path: '/playground' },
                    ]}
                />

                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">Playground</h1>
                    <p className="text-text-secondary">
                        Experimental projects, demos, and technical explorations.
                    </p>
                </header>

                {/* Playground Items */}
                {items.length > 0 ? (
                    isMobile ? (
                        <div className="space-y-2">
                            {items.map((item) => (
                                <ProjectCard key={item.slug} project={item} size="list" basePath="/playground" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map((item) => (
                                <ProjectCard key={item.slug} project={item} size="medium" basePath="/playground" />
                            ))}
                        </div>
                    )
                ) : (
                    <div className="text-center py-16 bg-surface rounded-xl">
                        <p className="text-text-muted text-lg mb-2">🧪</p>
                        <p className="text-text-secondary">
                            Experiments coming soon. Check back later!
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Playground;
