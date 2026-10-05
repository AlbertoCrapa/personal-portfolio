import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Play } from 'lucide-react';

import { Button } from '../arc/button/button';
import CollectionCard from './CollectionCard';
import LinkButton from './LinkButton';
import ListRow from './ListRow';
import { getProjectCover } from '../../utils/utils';

/**
 * ProjectCard — a project or playground entry as a card or a list row.
 *
 * Maps a project record onto CollectionCard: cover, title, blurb, the first
 * three technologies (each a link to the listing filtered by it), then role
 * and date in the byline.
 *
 * @param {Object} project
 * @param {string} size     - 'medium' | 'small' | 'list'
 * @param {string} basePath - detail route prefix ('/work' or '/playground')
 */

/** "2024-05" reads "May 2024"; open-ended entries ("2024-ongoing") read "Since 2024". */
export const formatProjectDate = (value) => {
    if (!value) return '';
    const parsed = new Date(`${value}-01T00:00:00Z`);
    if (!Number.isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
    }
    const [year, rest] = String(value).split('-');
    if (rest === 'ongoing') return `Since ${year}`;
    return rest ? `${year} to ${rest}` : value;
};

/**
 * Most `shortDescription` values open with a role label ("Technical Designer •
 * …") from before the card had a byline. Split it off: the byline shows the
 * role, and the label stands in when the record has no `role` of its own.
 */
const splitRole = (project) => {
    const text = project.shortDescription || project.description || '';
    const [lead, ...rest] = text.split(/\s*•\s*/);
    if (!rest.length) return { role: project.role, description: text };
    return { role: project.role || lead, description: rest.join(' • ') };
};

const ProjectCard = ({ project, size = 'medium', basePath = '/work' }) => {
    const navigate = useNavigate();
    if (!project) return null;

    const detailPath = `${basePath}/${project.slug}`;
    const projectLink = project.projectLink || project.url;
    const isPlayable = Boolean(project.experience);
    const { role, description } = splitRole(project);
    const meta = [role, formatProjectDate(project.date)];
    const compact = size === 'small';
    const playPath = `${detailPath}/play`;
    const listPath = basePath === '/playground' ? '/playground' : '/projects';

    if (size === 'list') {
        return (
            <ListRow
                to={detailPath}
                thumb={getProjectCover(project)}
                title={project.title}
                description={description}
                meta={meta}
                trailing={isPlayable ? (
                    <Button
                        variant="secondary"
                        size="sm"
                        aria-label={`Start ${project.title}`}
                        // The whole row is a link; this control cancels it and
                        // routes itself (a link inside a link is invalid).
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            navigate(playPath);
                        }}
                    >
                        <Play size={14} strokeWidth={1.75} aria-hidden="true" />
                    </Button>
                ) : null}
            />
        );
    }

    const overlay = isPlayable || (projectLink && !compact) ? (
        <>
            {isPlayable && (
                <LinkButton to={playPath} size="sm" aria-label={compact ? `Start ${project.title}` : undefined}>
                    <Play size={14} strokeWidth={1.75} aria-hidden="true" />
                    {!compact && 'Start'}
                </LinkButton>
            )}
            {projectLink && !compact && (
                <LinkButton href={projectLink} external size="sm" aria-label={`Open ${project.title} in a new tab`}>
                    <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                </LinkButton>
            )}
        </>
    ) : null;

    return (
        <CollectionCard
            to={detailPath}
            cover={getProjectCover(project)}
            video={project.previewVideo || project.videocover}
            title={project.title}
            description={description}
            tags={project.technologies || []}
            tagTo={(tag) => `${listPath}?tag=${encodeURIComponent(tag)}`}
            meta={meta}
            overlay={overlay}
            compact={compact}
        />
    );
};

export default React.memo(ProjectCard);
