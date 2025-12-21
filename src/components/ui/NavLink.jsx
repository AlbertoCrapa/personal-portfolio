import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NavLink Component
 * Arrow-prefixed navigation link matching the reference design
 * 
 * @param {string} to - Route path
 * @param {boolean} active - Current active state
 * @param {boolean} disabled - Disabled state
 * @param {boolean} bold - Bold text
 * @param {React.ReactNode} children - Link text
 */
const NavLink = ({ to, active, disabled, bold, children }) => {
    const baseClasses = "flex items-center gap-2 py-1 transition-colors text-base";

    const stateClasses = disabled
        ? "text-text-muted cursor-not-allowed"
        : active
            ? "text-text-primary"
            : "text-text-secondary hover:text-text-primary";

    const fontClasses = bold ? "font-semibold" : "font-normal";

    if (disabled) {
        return (
            <span className={`${baseClasses} ${stateClasses} ${fontClasses}`}>
                <span className="text-text-muted">→</span>
                {children}
            </span>
        );
    }

    // Handle hash links
    if (to.includes('#')) {
        return (
            <a
                href={to}
                className={`${baseClasses} ${stateClasses} ${fontClasses}`}
            >
                <span className={active ? "text-text-primary" : "text-text-muted"}>→</span>
                {children}
            </a>
        );
    }

    return (
        <Link
            to={to}
            className={`${baseClasses} ${stateClasses} ${fontClasses}`}
        >
            <span className={active ? "text-text-primary" : "text-text-muted"}>→</span>
            {children}
        </Link>
    );
};

export default NavLink;
