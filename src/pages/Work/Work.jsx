import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import VideoPlayer from '../../components/ui/VideoPlayer';
import ArticleBody from '../../components/ui/ArticleBody';
import MetaStrip from '../../components/ui/MetaStrip';
import { getArticleSummary, getTocSections, normalizeContent } from '../../components/ui/article/normalize';
import RevealSection from '../../components/ui/RevealSection';
import TableOfContents, { toId } from '../../components/ui/TableOfContents';
import { ShimmerText } from '../../components/ui/NavAnimations';
import { getProjectCover } from '../../utils/utils';
import projectData from '../../data/projects.json';
import playgroundData from '../../data/playground.json';

const PROJECT_TYPE_LABELS = {
    videogame: 'Video game',
    boardgame: 'Board game',
    webapp: 'Web app',
    playground: 'Experiment',
};

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
        ? (playgroundData.playground || []).filter((item) => !item.hidden)
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

    // Navigation to adjacent items (hide a button if it would point back to the current project)
    const prevCandidate = items[(currentIndex - 1 + items.length) % items.length];
    const nextCandidate = items[(currentIndex + 1) % items.length];
    const prevProject = prevCandidate && prevCandidate.slug !== slug ? prevCandidate : null;
    const nextProject = nextCandidate && nextCandidate.slug !== slug ? nextCandidate : null;
    const basePath = isPlayground ? '/playground' : '/work';
    const contentBlocks = normalizeContent(project?.content);
    const tocSections = getTocSections(contentBlocks, toId);
    const projectCover = getProjectCover(project);
    const projectVideoCover = project.previewVideo || project.videocover || projectCover;
    const summary = getArticleSummary(contentBlocks, 180);
    // "2024-05" formats as a month; "2024-ongoing" and friends are left alone.
    const projectDate = (() => {
        if (!project.date) return null;
        const parsed = new Date(`${project.date}-01`);
        return Number.isNaN(parsed.getTime())
            ? project.date
            : parsed.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    })();
    const typeLabel = PROJECT_TYPE_LABELS[project.type] || project.type;
    const workSchema = project ? {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: summary || `${project.title} by Alberto Crapanzano`,
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
                description={summary || `${project.title} by Alberto Crapanzano`}
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
                                    pauseOffscreen={false}
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
                    <header className="space-y-5 pt-4">
                        <div className="space-y-2.5">
                            <p className="flex flex-wrap items-center gap-2 text-xs font-semibold lowercase text-text-muted">
                                <span>{isPlayground ? 'Playground' : 'Project'}</span>
                                {typeLabel && (
                                    <>
                                        <span aria-hidden="true" className="opacity-50">/</span>
                                        <span>{typeLabel}</span>
                                    </>
                                )}
                            </p>

                            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-5xl">
                                {project.title}
                            </h1>

                            {project.subtitle && (
                                <p className="max-w-2xl text-lg text-text-secondary">{project.subtitle}</p>
                            )}
                        </div>

                        {/* Playable experience CTA */}
                        {project.experience && (
                            <Button to={`${basePath}/${slug}/play`} variant="quiet">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                                    <path d="M8 5.14v13.72a1 1 0 0 0 1.5.87l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z" />
                                </svg>
                                Start Experience
                            </Button>
                        )}

                        {/* The facts, as a labelled spec sheet rather than a run-on
                            line of unlabelled fragments. */}
                        <MetaStrip
                            facts={[
                                { label: 'Role', value: project.role },
                                { label: 'Timeline', value: projectDate },
                                { label: 'Team', value: project.teamSize ? `${project.teamSize} people` : null },
                                { label: 'Duration', value: project.duration },
                                { label: 'Access', value: project.nda ? 'Under NDA' : null },
                            ]}
                            highlight={project.outcome ? { label: 'Outcome', value: project.outcome } : null}
                            tags={project.technologies || []}
                            tagsLabel="Stack"
                            tagTo={(tag) => `${isPlayground ? '/playground' : '/projects'}?tag=${encodeURIComponent(tag)}`}
                            links={project.links || []}
                        />
                    </header>

                    {/* Content + ToC */}
                    <div className="flex gap-10 pt-8 xl:gap-24">
                        <div className="flex-1 min-w-0 max-w-3xl space-y-10">
                            <ArticleBody blocks={contentBlocks} title={project.title} />

                            {/* Navigation */}
                            <nav className="!mt-10 pt-8 border-t border-border">
                                <div className="flex justify-between items-start gap-8">
                                    {prevProject ? (
                                        <Link
                                            to={`${basePath}/${prevProject.slug}`}
                                            className="group flex flex-col gap-1 flex-1 max-w-[46%]"
                                        >
                                            <span className="text-xs lowercase text-text-muted group-hover:text-text-secondary transition-colors">
                                                ← Previous
                                            </span>
                                            <span className="text-sm font-semibold line-clamp-2 leading-snug">
                                                <ShimmerText text={prevProject.title} inactiveColor="var(--color-text-primary)" hoverColor="var(--color-text-secondary)" />
                                            </span>
                                        </Link>
                                    ) : (
                                        <span aria-hidden="true" />
                                    )}
                                    {nextProject ? (
                                        <Link
                                            to={`${basePath}/${nextProject.slug}`}
                                            className="group flex flex-col gap-1 flex-1 max-w-[46%] items-end text-right"
                                        >
                                            <span className="text-xs lowercase text-text-muted group-hover:text-text-secondary transition-colors">
                                                Next →
                                            </span>
                                            <span className="text-sm font-semibold line-clamp-2 leading-snug">
                                                <ShimmerText text={nextProject.title} inactiveColor="var(--color-text-primary)" hoverColor="var(--color-text-secondary)" />
                                            </span>
                                        </Link>
                                    ) : (
                                        <span aria-hidden="true" />
                                    )}
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
