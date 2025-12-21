import React from 'react';
import { Link } from 'react-router-dom';

/**
 * SectionHeader Component
 * Section title with optional "see all" link
 * 
 * @param {string} title - Section title
 * @param {string} seeAllLink - Optional link for "see all →"
 * @param {string} className - Additional classes
 */
const SectionHeader = ({ title, seeAllLink, className = '' }) => {
    return (
        <div className={`flex items-baseline gap-3 mb-4 ${className}`}>
            <h2 className="text-lg md:text-xl font-bold text-text-primary">
                {title}
            </h2>
            {seeAllLink && (
                <Link
                    to={seeAllLink}
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                >
                    see all →
                </Link>
            )}
        </div>
    );
};

export default SectionHeader;
