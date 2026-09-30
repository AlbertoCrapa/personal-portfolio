import React from 'react';

/**
 * Icon — the site's one line-icon set.
 *
 * Deliberately a single 24×24 stroke grid shared by every caller: same weight,
 * same cap, same round join, so a meta line and a list read as one system.
 * Not emoji — emoji arrive with the OS's own colour, shading and personality,
 * which is exactly the "realistic sticker" look this page shouldn't have.
 *
 * Unknown names render nothing, so data can name an icon that doesn't exist
 * yet without taking the page down.
 */

const GLYPHS = {
    user: <><circle cx="12" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /></>,
    users: <><circle cx="9" cy="7" r="4" /><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M17 3.5a4 4 0 0 1 0 7M22 21v-2a4 4 0 0 0-3-3.87" /></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
    lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
    chip: <><rect x="5" y="5" width="14" height="14" rx="2" /><rect x="9.5" y="9.5" width="5" height="5" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></>,
    sliders: <><path d="M4 21v-6M4 11V3M12 21v-9M12 8V3M20 21v-4M20 13V3" /><path d="M1.5 15h5M9.5 8h5M17.5 17h5" /></>,
    headphones: <><path d="M4 17v-4a8 8 0 0 1 16 0v4" /><rect x="1.5" y="14" width="5" height="7" rx="2" /><rect x="17.5" y="14" width="5" height="7" rx="2" /></>,
    sparkle: <><path d="M12 3.5 13.8 8.2 18.5 10 13.8 11.8 12 16.5 10.2 11.8 5.5 10 10.2 8.2z" /><path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" /></>,
    gamepad: <><path d="M7 11.5h4M9 9.5v4M15.5 12h.01M18 10h.01" /><path d="M17.3 5.5H6.7a4 4 0 0 0-4 3.5C2.6 9.6 2 14.5 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.4-1.4a2 2 0 0 1 1.4-.6h4.4a2 2 0 0 1 1.4.6L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.5-.6-6.4-.7-7A4 4 0 0 0 17.3 5.5z" /></>,
};

const Icon = ({ name, className = 'h-3.5 w-3.5' }) => {
    const glyph = GLYPHS[name];
    if (!glyph) return null;
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`flex-shrink-0 ${className}`}
        >
            {glyph}
        </svg>
    );
};

export default Icon;
