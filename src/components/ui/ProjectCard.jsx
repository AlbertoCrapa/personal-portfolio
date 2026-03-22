import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * ProjectCard Component
 * Card for displaying projects in grid layout
 * 
 * @param {Object} project - Project data
 * @param {string} size - 'large' | 'medium' | 'small' | 'list'
 * @param {string} basePath - Base path for links (default: '/work')
 */
const ProjectCard = ({ project, size = 'medium', basePath = '/work' }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [canPlayVideo, setCanPlayVideo] = useState(false);
    const videoRef = useRef(null);

    if (!project) return null;

    const thumbnailImage = project.thumbnailImage || project.cover;
    const previewVideo = project.previewVideo || project.videocover;
    const shortDescription = project.shortDescription || project.description;
    const projectDuration = project.duration;
    const projectLink = project.projectLink || project.url;

    const sizeClasses = {
        large: 'col-span-2 row-span-2',
        medium: 'col-span-1 row-span-1',
        small: 'col-span-1 row-span-1',
        list: 'flex items-center gap-4',
    };

    const imageHeights = {
        large: 'h-64 md:h-72',
        medium: 'h-44 md:h-52',
        small: 'h-32 md:h-40',
        list: 'w-32 h-20 md:w-40 md:h-24',
    };

    // List view for mobile projects page
    if (size === 'list') {
        return (
            <Link
                to={`${basePath}/${project.slug}`}
                className="flex items-center gap-4 group py-3 hover:bg-surface/50 rounded-lg transition-colors -mx-2 px-2"
            >
                <div className="flex-shrink-0 w-32 md:w-40 rounded-lg overflow-hidden">
                    <img
                        src={thumbnailImage}
                        alt={project.title}
                        className="w-full h-20 md:h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = 'https://placehold.co/400x300'; }}
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-text-primary group-hover:text-accent-blue transition-colors truncate">
                        {project.title}
                    </h3>
                    {shortDescription && (
                        <p className="text-sm text-text-muted line-clamp-1 mt-1">{shortDescription}</p>
                    )}
                </div>
            </Link>
        );
    }

    return (
        <Link
            to={`${basePath}/${project.slug}`}
            className={`block group ${sizeClasses[size]}`}
            onMouseEnter={() => {
                setIsHovered(true);
                if (previewVideo && videoRef.current) {
                    videoRef.current.play().catch(() => {
                        setCanPlayVideo(false);
                    });
                }
            }}
            onMouseLeave={() => {
                setIsHovered(false);
                if (videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0;
                }
            }}
        >
            <article className="relative rounded-xl overflow-hidden bg-surface border border-border hover:border-[#4a4a4a] transition-colors h-full">
                <div className={`${imageHeights[size]} overflow-hidden relative`}>
                    <img
                        src={thumbnailImage}
                        alt={project.title}
                        className={`w-full h-full object-cover transition-all duration-500 ${previewVideo && isHovered ? 'scale-[1.02] opacity-0' : 'scale-100 opacity-100'
                            }`}
                        onError={(e) => { e.target.src = 'https://placehold.co/400x300'; }}
                    />

                    {previewVideo && (
                        <video
                            ref={videoRef}
                            src={previewVideo}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            onCanPlay={() => setCanPlayVideo(true)}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered && canPlayVideo ? 'opacity-100' : 'opacity-0'
                                }`}
                        />
                    )}
                </div>

                <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className={`font-bold text-text-primary leading-tight ${size === 'large' ? 'text-xl md:text-2xl' : 'text-base md:text-lg'}`}>
                            {project.title}
                        </h3>
                        {projectLink && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(projectLink, '_blank', 'noopener,noreferrer');
                                }}
                                className="mt-0.5 text-text-secondary hover:text-text-primary transition-colors"
                                aria-label={`Open ${project.title}`}
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M14 4h6v6" />
                                    <path d="M10 14 20 4" />
                                    <path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {shortDescription && (
                        <p className="text-sm text-text-secondary line-clamp-2">
                            {shortDescription}
                        </p>
                    )}

                    {projectDuration && (
                        <p className="text-xs uppercase tracking-wide text-text-muted">
                            {projectDuration}
                        </p>
                    )}

                    {/* {previewVideo && (
                        <p className="text-[11px] text-text-muted/80 uppercase tracking-wider">
                            Hover to preview
                        </p>
                    )} */}
                </div>
            </article>
        </Link>
    );
};

export default ProjectCard;
