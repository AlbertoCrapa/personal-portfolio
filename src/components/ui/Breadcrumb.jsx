import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Breadcrumb Component
 * Navigation breadcrumb trail (home / projects / project-name /)
 * 
 * @param {Array} items - Array of { label, path } objects
 */
const Breadcrumb = ({ items }) => {
    return (
        <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-sm">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={item.path} className="flex items-center">
                            {item.path && !isLast ? (
                                <Link
                                    to={item.path}
                                    className="text-text-muted hover:text-text-primary transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className={isLast ? "text-text-primary font-semibold" : "text-text-muted"}>
                                    {item.label}
                                </span>
                            )}
                            <span className="mx-2 text-text-muted">/</span>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
