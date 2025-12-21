import React from 'react';
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
    if (!project) return null;

    const sizeClasses = {
        large: 'col-span-2 row-span-2',
        medium: 'col-span-1 row-span-1',
        small: 'col-span-1 row-span-1',
        list: 'flex items-center gap-4',
    };

    const imageHeights = {
        large: 'h-64 md:h-80',
        medium: 'h-40 md:h-48',
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
                        src={project.cover}
                        alt={project.title}
                        className="w-full h-20 md:h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = 'https://placehold.co/400x300'; }}
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-text-primary group-hover:text-accent-blue transition-colors truncate">
                        {project.title}
                    </h3>
                </div>
            </Link>
        );
    }

    return (
        <Link
            to={`${basePath}/${project.slug}`}
            className={`block group ${sizeClasses[size]}`}
        >
            <div className="relative rounded-xl overflow-hidden h-full">
                {/* Image */}
                <div className={`${imageHeights[size]} overflow-hidden`}>
                    <img
                        src={project.cover}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = 'https://placehold.co/400x300'; }}
                    />
                </div>

                {/* Title Overlay */}
                <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <h3 className={`font-bold text-text-primary ${size === 'large' ? 'text-xl md:text-2xl' : 'text-base md:text-lg'}`}>
                        {project.title}
                    </h3>
                </div>
            </div>
        </Link>
    );
};

export default ProjectCard;
