import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import VideoPlayer from '../../components/ui/VideoPlayer';
import ModelViewer from '../../components/ui/ModelViewer';
import RichText from '../../components/ui/RichText';
import RevealSection from '../../components/ui/RevealSection';
import TableOfContents, { toId } from '../../components/ui/TableOfContents';
import { ShimmerText } from '../../components/ui/NavAnimations';
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
            <>
                <SEO title="Project Not Found - Alberto Crapanzano" noindex />
                <div className="min-h-[60svh] flex flex-col items-center justify-center text-center">
                    <h1 className="text-5xl font-bold text-text-primary mb-4">Oops!</h1>
                    <p className="text-text-secondary mb-6">The project you're looking for doesn't exist.</p>
                    <div className="flex gap-4">
                        <Button to="/" variant="primary">← Go Home</Button>
                        <Button onClick={() => navigate(-1)} variant="secondary">Go Back</Button>
                    </div>
                </div>
            </>
        );
    }

    // Navigation to adjacent items
    const prevProject = items[(currentIndex - 1 + items.length) % items.length];
    const nextProject = items[(currentIndex + 1) % items.length];
    const basePath = isPlayground ? '/playground' : '/work';
    const contentElements = Array.isArray(project?.content) ? project.content : [];
    const tocSections = contentElements
        .filter((el) => el?.title && (el?.type === 'section' || !el?.type))
        .map((el) => ({ id: toId(el.title), title: el.title }));
    const projectCover = project.thumbnailImage || project.cover;
    const projectVideoCover = project.previewVideo || project.videocover || projectCover;
    const firstTextSection = contentElements.find(
        (item) => (item?.type === 'section' || (!item?.type && item?.text)) && typeof item?.text === 'string' && item.text.trim()
    );
    const workSchema = project ? {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: firstTextSection?.text?.substring(0, 180) || `${project.title} by Alberto Crapanzano`,
        image: projectCover ? `https://albyeah.com${projectCover}` : 'https://albyeah.com/img/profile.jpg',
        dateCreated: project.date,
        genre: project.type || (isPlayground ? 'interactive prototype' : 'software project'),
        creator: {
            '@type': 'Person',
            name: 'Alberto Crapanzano',
            url: 'https://albyeah.com/about',
        },
        url: `https://albyeah.com${basePath}/${slug}`,
    } : null;

    // Check if media is video
    const isVideo = (src) => {
        if (!src) return false;
        return /\.(mp4|webm|mov)$/i.test(src);
    };


    return (
        <>
            <SEO
                title={`${project.title} - Alberto Crapanzano | Game Developer Portfolio`}
                description={firstTextSection?.text?.substring(0, 160) || `${project.title} by Alberto Crapanzano`}
                keywords={`${project.title}, ${project.technologies?.join(', ') || ''}, Alberto Crapanzano, Game Development`}
                url={`${basePath}/${slug}`}
                image={projectCover ? `https://albyeah.com${projectCover}` : undefined}
                type="article"
                structuredData={workSchema}
            />

            <RevealSection>
                <div className="space-y-1">
                    {/* Breadcrumb */}
                    <Breadcrumb
                        items={[
                            { label: 'home', path: '/' },
                            { label: isPlayground ? 'playground' : 'projects', path: isPlayground ? '/playground' : '/projects' },
                            { label: slug, path: `${basePath}/${slug}` },
                        ]}
                    />

                    {/* Cover Media - FIRST */}
                    {projectCover && (
                        <div className="rounded-xl overflow-hidden h-44 sm:h-52 md:h-56 lg:h-64 max-h-[280px]">
                            {isVideo(projectVideoCover) ? (
                                <VideoPlayer
                                    src={projectVideoCover}
                                    poster={projectCover}
                                    className="w-full h-full"
                                />
                            ) : (
                                <img
                                    src={projectCover}
                                    alt={project.title}
                                    className="w-full h-full object-cover object-center"
                                    onError={(e) => { e.target.src = 'https://placehold.co/800x600'; }}
                                />
                            )}
                        </div>
                    )}

                    {/* Project Header - AFTER cover */}
                    <header className="space-y-4 pt-2">
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
                            {project.role && (
                                <span>Role: {project.role}</span>
                            )}
                        </div>

                        {project.outcome && (
                            <p className="text-sm text-text-secondary bg-surface border border-border rounded-lg px-3 py-2 inline-block">
                                Outcome: {project.outcome}
                            </p>
                        )}

                        {/* Technology Tags */}
                        {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {project.technologies.map((tech) => (
                                    <span
                                        key={tech}
                                        className="tag-capsule"
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

                    {/* Content + ToC */}
                    <div className="flex gap-32 pt-8">
                        <div className="flex-1 min-w-0 max-w-3xl space-y-8 md:space-y-10">
                            {contentElements.map((element, idx) => {
                                const elementType = element?.type || (element?.src ? 'media' : 'section');

                                if (elementType === 'model' && element?.src) {
                                    return (
                                        <section key={idx} className={"space-y-2 md:space-y-4 max-w-3xl"}>
                                            <div>
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
                                        <section key={idx} className={"space-y-2 md:space-y-4 max-w-3xl"}>
                                            <div>
                                                {isVideo(element.src) ? (
                                                    <figure className="space-y-1">
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
                                                    <figure className="space-y-1">
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
                                    <section key={idx} className={"space-y-2 md:space-y-4 max-w-3xl"}>
                                        {element?.title && (
                                            <h2 id={toId(element.title)} className="text-2xl font-bold text-text-primary">
                                                {element.title}
                                            </h2>
                                        )}
                                        {element?.text && (
                                            <RichText text={element.text} />
                                        )}
                                    </section>
                                );
                            })}

                            {/* Navigation */}
                            <nav className="!mt-10 pt-8 border-t border-border">
                                <div className="flex justify-between items-start gap-8">
                                    <Link
                                        to={`${basePath}/${prevProject.slug}`}
                                        className="group flex flex-col gap-1 flex-1 max-w-[46%]"
                                    >
                                        <span className="text-xs uppercase tracking-wider text-text-muted group-hover:text-text-secondary transition-colors">
                                            ← Previous
                                        </span>
                                        <span className="text-sm font-semibold line-clamp-2 leading-snug">
                                            <ShimmerText text={prevProject.title} inactiveColor="#ffffff" hoverColor="#a0a0a0" />
                                        </span>
                                    </Link>
                                    <Link
                                        to={`${basePath}/${nextProject.slug}`}
                                        className="group flex flex-col gap-1 flex-1 max-w-[46%] items-end text-right"
                                    >
                                        <span className="text-xs uppercase tracking-wider text-text-muted group-hover:text-text-secondary transition-colors">
                                            Next →
                                        </span>
                                        <span className="text-sm font-semibold line-clamp-2 leading-snug">
                                            <ShimmerText text={nextProject.title} inactiveColor="#ffffff" hoverColor="#a0a0a0" />
                                        </span>
                                    </Link>
                                </div>
                            </nav>
                        </div>
                        <TableOfContents sections={tocSections} />
                    </div>
                </div>
            </RevealSection>
        </>
    );
};

export default Work;
