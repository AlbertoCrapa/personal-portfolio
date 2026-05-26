import React from 'react';
import { ShimmerText } from './NavAnimations';

/**
 * Converts a section title to a URL-safe id.
 * Export so pages can reuse the same logic when attaching id to headings.
 */
export const toId = (title) =>
    title
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

/**
 * Sticky table-of-contents sidebar.
 * CSS position:sticky works here because Layout uses overflow-x:clip
 * (not overflow-x:hidden) — clip doesn't create a scroll container.
 *
 * Only renders on lg+ screens.
 * Props: sections – [{ id: string, title: string }]
 */
const TableOfContents = ({ sections = [] }) => {
    const [activeId, setActiveId] = React.useState('');

    // Track active section via IntersectionObserver
    React.useEffect(() => {
        if (!sections.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length > 0) setActiveId(visible[0].target.id);
            },
            { rootMargin: '-70px 0px -55% 0px', threshold: 0 },
        );

        sections.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [sections]);

    if (!sections.length) return null;

    return (
        <aside className="hidden lg:block w-64 flex-shrink-0">
            <div
                className="sticky space-y-0.5"
                style={{ top: '72px' }}
            >
                <p className="text-xs uppercase tracking-widest text-text-muted pb-2 mb-1 border-b border-border">
                    On this page
                </p>
                {sections.map(({ id, title }) => (
                    <a
                        key={id}
                        href={`#${id}`}
                        className={`block text-sm py-1 pl-2 border-l-2 leading-snug ${
                            activeId === id
                                ? 'border-text-secondary font-medium'
                                : 'border-transparent hover:border-border'
                        }`}
                    >
                        <ShimmerText text={title} active={activeId === id} />
                    </a>
                ))}
            </div>
        </aside>
    );
};

export default TableOfContents;
