import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NavLink Component
 * Navigation link (no arrow prefix)
 */
const NavLink = ({ to, active, disabled, children }) => {
    const baseClasses = "flex items-center py-1 transition-colors text-base font-semibold";

    const stateClasses = disabled
        ? "text-text-muted cursor-not-allowed"
        : active
            ? "text-text-primary"
            : "text-text-secondary hover:text-text-primary";

    if (disabled) {
        return <span className={`${baseClasses} ${stateClasses}`}>{children}</span>;
    }

    if (to.includes('#')) {
        return (
            <a href={to} className={`${baseClasses} ${stateClasses}`}>
                {children}
            </a>
        );
    }

    return (
        <Link to={to} className={`${baseClasses} ${stateClasses}`}>
            {children}
        </Link>
    );
};

export default NavLink;
