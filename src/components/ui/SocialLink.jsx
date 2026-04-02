import React from 'react';

/**
 * SocialLink Component
 * Arrow-prefixed external link for social platforms
 * 
 * @param {string} href - External URL
 * @param {string} hoverColor - Tailwind hover color class (e.g., "hover:text-[#1DA1F2]")
 * @param {string} glowColor - Hex color for subtle glow effect
 * @param {React.ReactNode} children - Link text
 */
const SocialLink = ({ href, children, hoverColor = 'hover:text-text-primary', glowColor, ariaLabel }) => {
    const computedAriaLabel = ariaLabel || (typeof children === 'string' ? children : undefined);

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={computedAriaLabel}
            className={`social-link flex items-center font-semibold gap-2 py-1 text-sm text-text-secondary ${hoverColor} transition-all duration-300`}
            style={{
                '--glow-color': glowColor || 'transparent',
            }}
        >
            <span className="text-text-muted">→</span>
            {children}
            <style>{`
                .social-link:hover {
                    text-shadow: 0 0 8px var(--glow-color), 0 0 16px color-mix(in srgb, var(--glow-color) 40%, transparent);
                }
            `}</style>
        </a>
    );
};

export default SocialLink;
