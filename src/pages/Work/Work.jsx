import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../layouts/Layout';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import VideoPlayer from '../../components/ui/VideoPlayer';
import ModelViewer from '../../components/ui/ModelViewer';
import RichText from '../../components/ui/RichText';
import projectData from '../../data/projects.json';
import playgroundData from '../../data/playground.json';

/**
 * Work/Project Detail Page
 * Displays full project information with media and content sections
 * Supports both projects and playground items via source prop
 */
const Work = ({ source = 'projects' }) => {
    const { slug } = useParams();
    const navigate = useNavigate();

    // Get items based on source
    const isPlayground = source === 'playground';
    const items = isPlayground
        ? playgroundData.playground || []
        : Object.values(projectData.projects);

    const currentIndex = items.findIndex((p) => p.slug === slug);
    const project = items[currentIndex];

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [slug]);

    // 404 handling
    if (!project) {
        return (
            <Layout>
                <SEO title="Project Not Found - Alberto Crapanzano" noindex />
                <div className="min-h-[60svh] flex flex-col items-center justify-center text-center">
                    <h1 className="text-5xl font-bold text-text-primary mb-4">Oops!</h1>
                    <p className="text-text-secondary mb-6">The project you're looking for doesn't exist.</p>
                    <div className="flex gap-4">
                        <Button to="/" variant="primary">← Go Home</Button>
                        <Button onClick={() => navigate(-1)} variant="secondary">Go Back</Button>
                    </div>
                </div>
            </Layout>
        );
    }

    // Navigation to adjacent items
    const prevProject = items[(currentIndex - 1 + items.length) % items.length];
    const nextProject = items[(currentIndex + 1) % items.length];
    const basePath = isPlayground ? '/playground' : '/work';
    const contentElements = Array.isArray(project?.content) ? project.content : [];
    const firstTextSection = contentElements.find(
        (item) => (item?.type === 'section' || (!item?.type && item?.text)) && typeof item?.text === 'string' && item.text.trim()
    );

    // Check if media is video
    const isVideo = (src) => {
        if (!src) return false;
        return /\.(mp4|webm|mov)$/i.test(src);
    };

    return (
        <Layout>
            <SEO
                title={`${project.title} - Alberto Crapanzano | Game Developer Portfolio`}
                description={firstTextSection?.text?.substring(0, 160) || `${project.title} by Alberto Crapanzano`}
                keywords={`${project.title}, ${project.technologies?.join(', ') || ''}, Alberto Crapanzano, Game Development`}
                url={`${basePath}/${slug}`}
                image={project.cover ? `https://albyeah.com${project.cover}` : undefined}
                type="article"
            />

            <div className="space-y-2">
                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        { label: 'home', path: '/' },
                        { label: isPlayground ? 'playground' : 'projects', path: isPlayground ? '/playground' : '/projects' },
                        { label: slug, path: `${basePath}/${slug}` },
                    ]}
                />

                {/* Cover Media - FIRST */}
                {project.cover && (
                    <div className="rounded-xl overflow-hidden h-44 sm:h-52 md:h-56 lg:h-64 max-h-[280px]">
                        {isVideo(project.videocover || project.cover) ? (
                            <VideoPlayer
                                src={project.videocover || project.cover}
                                poster={project.cover}
                                className="w-full h-full"
                            />
                        ) : (
                            <img
                                src={project.cover}
                                alt={project.title}
                                className="w-full h-full object-cover object-center"
                                onError={(e) => { e.target.src = 'https://placehold.co/800x600'; }}
                            />
                        )}
                    </div>
                )}

                {/* Project Header - AFTER cover */}
                <header className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-text-primary">
                        {project.title}
                    </h1>

                    {/* Subtitle/Type */}
                    {project.subtitle && (
                        <p className="text-lg text-text-secondary">{project.subtitle}</p>
                    )}

                    {/* Project Metadata */}
                    <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                        {project.date && (
                            <span>
                                {new Date(project.date + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                        )}
                        {project.teamSize && (
                            <span>Team of {project.teamSize}</span>
                        )}
                    </div>

                    {/* Technology Tags */}
                    {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech) => (
                                <span
                                    key={tech}
                                    className="text-xs px-3 py-1.5 bg-surface rounded-full text-text-secondary border border-border hover:border-accent-blue hover:text-accent-blue transition-colors"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* External Links */}
                    {project.links && project.links.length > 0 && (
                        <div className="space-y-1">
                            <p className="text-sm text-text-muted">External links:</p>
                            <div className="flex flex-wrap gap-3">
                                {project.links.map((link, i) => (
                                    <a
                                        key={i}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent-blue hover:underline font-medium"
                                    >
                                        {link.label || 'Link'}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </header>

                {/* Content Elements */}
                {contentElements.length > 0 && (
                    <div className="space-y-12">
                        {contentElements.map((element, idx) => {
                            const elementType = element?.type || (element?.src ? 'media' : 'section');

                            if (elementType === 'model' && element?.src) {
                                return (
                                    <section key={idx} className="space-y-4">
                                        <div className="mt-4 max-w-4xl">
                                            <ModelViewer
                                                src={element.src}
                                                poster={element.poster}
                                                alt={element.alt || element.description || `${project.title} 3D model`}
                                                description={element.description}
                                                className="w-full h-[280px] sm:h-[340px] md:h-[420px]"
                                            />
                                        </div>
                                    </section>
                                );
                            }

                            if (elementType === 'media' && element?.src) {
                                return (
                                    <section key={idx} className="space-y-4">
                                        <div className="mt-4 max-w-3xl">
                                            {isVideo(element.src) ? (
                                                <figure className="space-y-2">
                                                    <div className="rounded-xl overflow-hidden">
                                                        <VideoPlayer
                                                            src={element.src}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    {element.description && (
                                                        <figcaption className="text-sm text-text-muted text-center">
                                                            {element.description}
                                                        </figcaption>
                                                    )}
                                                </figure>
                                            ) : (
                                                <figure className="space-y-2">
                                                    <div className="rounded-xl overflow-hidden">
                                                        <img
                                                            src={element.src}
                                                            alt={element.description || `${project.title} media`}
                                                            className="w-full h-auto"
                                                            onError={(e) => { e.target.src = 'https://placehold.co/800x600'; }}
                                                        />
                                                    </div>
                                                    {element.description && (
                                                        <figcaption className="text-sm text-text-muted text-center">
                                                            {element.description}
                                                        </figcaption>
                                                    )}
                                                </figure>
                                            )}
                                        </div>
                                    </section>
                                );
                            }

                            return (
                                <section key={idx} className="space-y-4">
                                    {element?.title && (
                                        <h2 className="text-2xl font-bold text-text-primary">
                                            {element.title}
                                        </h2>
                                    )}
                                    {element?.text && (
                                        <RichText text={element.text} />
                                    )}
                                </section>
                            );
                        })}
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex justify-between items-center pt-8 border-t border-border">
                    <Button
                        to={`${basePath}/${prevProject.slug}`}
                        variant="ghost"
                        className="flex items-center gap-2"
                    >
                        ← {prevProject.title}
                    </Button>
                    <Button
                        to={`${basePath}/${nextProject.slug}`}
                        variant="ghost"
                        className="flex items-center gap-2"
                    >
                        {nextProject.title} →
                    </Button>
                </nav>
            </div>
        </Layout>
    );
};

export default Work;
