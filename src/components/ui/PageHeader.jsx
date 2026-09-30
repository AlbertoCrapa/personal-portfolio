import React from 'react';

/**
 * PageHeader — the "/title + subtitle" block every listing page opens with.
 *
 * Extracted verbatim from the pages that had each written their own copy of
 * it, so the type scale, the muted slash and the measure stay identical across
 * /projects, /playground and /blog. Deliberately unanimated beyond the section
 * reveal its parent already provides: this is the page's anchor, and an anchor
 * that moves isn't one.
 */
const PageHeader = ({ title, subtitle, children, className = '' }) => (
    <header className={className}>
        {/* sr-only on mobile: hidden visually, kept for screen readers and SEO. */}
        <h1 className="sr-only mb-2 text-3xl font-bold lowercase text-text-primary md:not-sr-only md:mb-2 md:text-4xl">
            <span className="mr-2 text-text-muted">/</span>
            {title}
        </h1>
        {subtitle && <p className="max-w-2xl text-text-secondary">{subtitle}</p>}
        {children}
    </header>
);

export default PageHeader;
