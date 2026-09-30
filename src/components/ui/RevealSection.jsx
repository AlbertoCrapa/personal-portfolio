import React from 'react';

import Reveal from './motion/Reveal';

/**
 * RevealSection — page-level scroll entrance.
 *
 * Kept as a named wrapper because every page imports it, but the behaviour now
 * lives in Reveal so sections and the cards inside them share one curve.
 * Blur is off here: page wrappers can contain video and canvases, and a filter
 * on that subtree forces an expensive offscreen composite on every frame.
 */
const RevealSection = ({ children, className = '', delay = 0 }) => (
    <Reveal className={className} delay={delay / 1000} blur={0} amount={0.04}>
        {children}
    </Reveal>
);

export default RevealSection;
