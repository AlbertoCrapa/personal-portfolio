import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import MediaCard from './motion/MediaCard';
import MediaRow from './motion/MediaRow';
import { SPRING_PRESS, TAP_SCALE, useReducedMotion } from '../../utils/motion';
import { getProjectCover } from '../../utils/utils';

/**
 * ProjectCard — projects and playground entries, in card or row form.
 *
 * All the layout and motion lives in MediaCard / MediaRow; this file's only
 * job is turning a project record into the card's vocabulary, which is where
 * the readability fix actually happens:
 *
 *   role + timeframe  → the eyebrow, so "Technical Designer · 2024" leads
 *   stack             → one dotted footer line, overflow collapsed into "+n"
 *
 * instead of four same-weight blocks fighting under the cover.
 *
 * @param {Object} project - Project data
 * @param {string} size - 'large' | 'medium' | 'small' | 'list'
 * @param {string} basePath - Base path for links (default: '/work')
 */

const PlayIcon = ({ className = 'h-3.5 w-3.5' }) => (
    // Centroid sits on the viewBox centre, so the glyph needs no nudge to
    // look centred inside a round button.
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M8 5.5v13l12-6.5z" />
    </svg>
);

/**
 * "2024-05" → "May 2024". Open-ended entries are written "2024-ongoing" in the
 * data, which is not a parseable date — those become "2024 — ongoing" rather
 * than leaking the raw hyphenated token into the card.
 */
export const formatProjectDate = (value) => {
    if (!value) return '';
    const parsed = new Date(`${value}-01`);
    if (!Number.isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    const [year, rest] = String(value).split('-');
    return rest ? `${year} — ${rest}` : value;
};

/**
 * Drop a role prefix the card's eyebrow is already showing.
 *
 * Most `shortDescription` values open with "Technical Designer • …" because
 * they predate the card having a role line of its own; printing both makes the
 * blurb read as a stutter.
 */
const stripRolePrefix = (description, role) => {
    if (!description || !role) return description;
    const trimmed = description.trim();
    if (!trimmed.toLowerCase().startsWith(role.trim().toLowerCase())) return description;
    const rest = trimmed.slice(role.trim().length).replace(/^\s*[•·\-–—:]\s*/, '');
    return rest || description;
};

const ProjectCard = ({ project, size = 'medium', basePath = '/work' }) => {
    const navigate = useNavigate();
    const reduce = useReducedMotion();

    if (!project) return null;

    const cover = getProjectCover(project);
    const previewVideo = project.previewVideo || project.videocover;
    const description = stripRolePrefix(project.shortDescription || project.description, project.role);
    const projectLink = project.projectLink || project.url;
    const technologies = Array.isArray(project.technologies) ? project.technologies : [];
    const isPlayable = Boolean(project.experience);
    const detailPath = `${basePath}/${project.slug}`;
    const playPath = `${detailPath}/play`;

    // The card is a link; an inner <a> would be invalid HTML, so the playable
    // shortcut stays a button and routes imperatively after cancelling the
    // outer navigation.
    const goToExperience = (event) => {
        event.preventDefault();
        event.stopPropagation();
        navigate(playPath);
    };

    const openExternal = (event) => {
        event.preventDefault();
        event.stopPropagation();
        window.open(projectLink, '_blank', 'noopener,noreferrer');
    };

    const eyebrow = [project.role, project.duration || formatProjectDate(project.date)];
    const isCompact = size === 'small';

    if (size === 'list') {
        return (
            <MediaRow
                to={detailPath}
                thumb={cover}
                title={project.title}
                eyebrow={eyebrow}
                description={description}
                trailing={
                    isPlayable ? (
                        <motion.button
                            type="button"
                            onClick={goToExperience}
                            whileTap={reduce ? undefined : { scale: TAP_SCALE }}
                            transition={SPRING_PRESS}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-blue text-white"
                            aria-label={`Start ${project.title}`}
                            title="Start experience"
                        >
                            <PlayIcon className="h-3 w-3" />
                        </motion.button>
                    ) : null
                }
            />
        );
    }

    return (
        <MediaCard
            to={detailPath}
            cover={cover}
            video={previewVideo}
            title={project.title}
            eyebrow={eyebrow}
            description={description}
            footer={technologies.slice(0, 3)}
            footerMore={Math.max(0, technologies.length - 3)}
            accent={project.bgColor}
            size={size}
            badge={
                (isPlayable || (projectLink && !isCompact)) ? (
                    <div className="flex items-center gap-2">
                        {isPlayable && (
                            <motion.button
                                type="button"
                                onClick={goToExperience}
                                whileTap={reduce ? undefined : { scale: TAP_SCALE }}
                                whileHover={reduce ? undefined : { scale: 1.06 }}
                                transition={SPRING_PRESS}
                                className={`inline-flex items-center justify-center rounded-full bg-accent-blue font-semibold text-white shadow-[var(--card-shadow)] ${isCompact ? 'h-8 w-8 shrink-0 ring-1 ring-white/25' : 'gap-1.5 py-1.5 pl-2.5 pr-3 text-xs'
                                    }`}
                                aria-label={`Start ${project.title}`}
                                title="Start experience"
                            >
                                <PlayIcon />
                                {/* A small card has no room for a label without
                                    covering the artwork it sits on. */}
                                {!isCompact && 'Start'}
                            </motion.button>
                        )}
                        {projectLink && !isCompact && (
                            <motion.button
                                type="button"
                                onClick={openExternal}
                                whileTap={reduce ? undefined : { scale: TAP_SCALE }}
                                whileHover={reduce ? undefined : { scale: 1.06 }}
                                transition={SPRING_PRESS}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border-strong bg-bg/80 text-text-secondary backdrop-blur-sm hover:text-text-primary"
                                aria-label={`Open ${project.title} in a new tab`}
                                title="Open project"
                            >
                                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 4h6v6M10 14 20 4M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />
                                </svg>
                            </motion.button>
                        )}
                    </div>
                ) : null
            }
        />
    );
};

export default React.memo(ProjectCard);
