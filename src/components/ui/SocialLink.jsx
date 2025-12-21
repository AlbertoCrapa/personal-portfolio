import React from 'react';

/**
 * SocialLink Component
 * Arrow-prefixed external link for social platforms
 * 
 * @param {string} href - External URL
 * @param {React.ReactNode} children - Link text
 */
const SocialLink = ({ href, children }) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 py-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
            <span className="text-text-muted">→</span>
            {children}
        </a>
    );
};

export default SocialLink;
