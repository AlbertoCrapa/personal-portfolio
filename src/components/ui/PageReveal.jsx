import React from 'react';

/**
 * PageReveal — the page's blocks rise a few pixels out of a soft blur when a
 * page opens. Kept small and quick on purpose: it plays on every navigation,
 * so it has to stay pleasant the hundredth time.
 *
 * Pure CSS (`.page-reveal` in theme.css): a CSS animation starts the moment an
 * element is first styled, so a block can never paint once and then vanish
 * before its entrance, which a JS pass after mount could not guarantee.
 *
 * The class comes off once the entrance is over, so items that mount later
 * (a filter change in a listing) keep their own motion instead of this one.
 * Mounted with `key={pathname}`, so every page gets a fresh entrance.
 */
const ENTRANCE_MS = 1200;

const PageReveal = ({ children }) => {
    const [active, setActive] = React.useState(true);

    React.useEffect(() => {
        const id = window.setTimeout(() => setActive(false), ENTRANCE_MS);
        return () => window.clearTimeout(id);
    }, []);

    return <div className={active ? 'page-reveal' : undefined} style={{ display: 'contents' }}>{children}</div>;
};

export default PageReveal;
