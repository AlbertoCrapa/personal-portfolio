import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play } from 'lucide-react';

import SEO from '../../components/SEO';
import ArticleLayout from '../../components/ui/ArticleLayout';
import LinkButton from '../../components/ui/LinkButton';
import MetaStrip from '../../components/ui/MetaStrip';
import NotFoundState from '../../components/ui/NotFoundState';
import { getArticleSummary, getTocSections, normalizeContent } from '../../components/ui/article/normalize';
import { toId } from '../../components/ui/TableOfContents';
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
 * Work — a project (/work/:slug) or a playground experiment
 * (/playground/:slug). Job: understand the role, the stack and the outcome,
 * then read. The primary action, when there is one, is starting the
 * playable build.
 */
const Work = ({ source = 'projects' }) => {
    const { slug } = useParams();

    const isPlayground = source === 'playground';
    const items = isPlayground
        ? (playgroundData.playground || []).filter((item) => !item.hidden)
        : Object.values(projectData.projects);

    const currentIndex = items.findIndex((p) => p.slug === slug);
    const project = items[currentIndex];

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [slug]);

    if (!project) {
        return (
            <>
                <SEO title="Project Not Found - Alberto Crapanzano" noindex />
                <NotFoundState
                    title="Project not found"
                    description="This project was moved or never existed. The full list is one click away."
                    to={isPlayground ? '/playground' : '/projects'}
                    label={isPlayground ? 'Browse experiments' : 'Browse projects'}
                />
            </>
        );
    }

    // Adjacent items wrap around; hide a link that would point back here.
    const prevCandidate = items[(currentIndex - 1 + items.length) % items.length];
    const nextCandidate = items[(currentIndex + 1) % items.length];
    const prevProject = prevCandidate && prevCandidate.slug !== slug ? prevCandidate : null;
    const nextProject = nextCandidate && nextCandidate.slug !== slug ? nextCandidate : null;
    const basePath = isPlayground ? '/playground' : '/work';
    const listPath = isPlayground ? '/playground' : '/projects';
    const contentBlocks = normalizeContent(project?.content);
    const tocSections = getTocSections(contentBlocks, toId);
    const projectCover = getProjectCover(project);
    const projectVideoCover = project.previewVideo || project.videocover || projectCover;
    const summary = getArticleSummary(contentBlocks, 180);
    // "2024-05" formats as a month; "2024-ongoing" and friends are left alone.
    const projectDate = (() => {
        if (!project.date) return null;
        const parsed = new Date(`${project.date}-01T00:00:00Z`);
        return Number.isNaN(parsed.getTime())
            ? project.date
            : parsed.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    })();
    const workSchema = project ? {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: summary || `${project.title} by Alberto Crapanzano`,
        image: projectCover ? `https://albyeah.com${projectCover}` : 'https://albyeah.com/img/og-image.jpg',
        dateCreated: project.date,
        genre: project.type || (isPlayground ? 'interactive prototype' : 'software project'),
        creator: {
            '@type': 'Person',
            name: 'Alberto Crapanzano',
            url: 'https://albyeah.com/about',
        },
        url: `https://albyeah.com${basePath}/${slug}`,
    } : null;


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

            <ArticleLayout
                breadcrumb={[
                    { label: 'home', path: '/' },
                    { label: isPlayground ? 'playground' : 'projects', path: listPath },
                    { label: project.title, path: `${basePath}/${slug}` },
                ]}
                cover={projectCover ? projectVideoCover : null}
                poster={projectCover}
                title={project.title}
                badge={PROJECT_TYPE_LABELS[project.type] || project.type}
                subtitle={project.subtitle}
                action={project.experience ? (
                    <LinkButton to={`${basePath}/${slug}/play`} variant="primary">
                        <Play size={16} strokeWidth={1.75} aria-hidden="true" />
                        Start the experience
                    </LinkButton>
                ) : null}
                meta={(
                    <MetaStrip
                        facts={[
                            { label: 'Role', value: project.role },
                            { label: 'Timeline', value: projectDate },
                            { label: 'Team', value: project.teamSize ? `${project.teamSize} ${project.teamSize === 1 ? 'person' : 'people'}` : null },
                            { label: 'Duration', value: project.duration },
                            { label: 'Access', value: project.nda ? 'Under NDA' : null },
                        ]}
                        highlight={project.outcome ? { label: 'Outcome', value: project.outcome } : null}
                        tags={project.technologies || []}
                        tagsLabel="Stack"
                        tagTo={(tag) => `${listPath}?tag=${encodeURIComponent(tag)}`}
                        links={project.links || []}
                    />
                )}
                blocks={contentBlocks}
                tocSections={tocSections}
                previous={prevProject && { to: `${basePath}/${prevProject.slug}`, title: prevProject.title }}
                next={nextProject && { to: `${basePath}/${nextProject.slug}`, title: nextProject.title }}
            />
        </>
    );
};

export default Work;
