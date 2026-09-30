import React from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

import { SPRING_SWAP, useHoverCapable, useReducedMotion } from '../../../utils/motion';

/**
 * SocialDock — macOS-style magnification for the top bar's social icons.
 *
 * Each icon's scale is a function of its distance from the cursor, so the row
 * swells around the pointer instead of the icon under it popping alone: the
 * neighbours tell you where you are before you arrive. The per-platform glow
 * the bar already used is kept exactly as it was.
 *
 * Falls back to a plain row on touch devices and under reduced motion, where
 * there is no cursor to magnify toward.
 *
 * Props:
 *   links – [{ label, url, icon, hoverColor, glowColor }]
 */

const MAGNIFY_RANGE = 90; // px of cursor travel over which an icon grows
const MAX_SCALE = 1.5;

const DockIcon = ({ link, mouseX, active }) => {
    const ref = React.useRef(null);
    const [hovered, setHovered] = React.useState(false);

    const distance = useTransform(mouseX, (value) => {
        const bounds = ref.current?.getBoundingClientRect();
        if (!bounds || value === null) return MAGNIFY_RANGE * 2;
        return value - bounds.x - bounds.width / 2;
    });

    const targetScale = useTransform(
        distance,
        [-MAGNIFY_RANGE, 0, MAGNIFY_RANGE],
        [1, MAX_SCALE, 1],
        { clamp: true },
    );
    const targetLift = useTransform(distance, [-MAGNIFY_RANGE, 0, MAGNIFY_RANGE], [0, -3, 0], {
        clamp: true,
    });

    const scale = useSpring(targetScale, { stiffness: 320, damping: 22, mass: 0.35 });
    const y = useSpring(targetLift, { stiffness: 320, damping: 22, mass: 0.35 });

    return (
        <a
            ref={ref}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            onMouseEnter={(event) => {
                setHovered(true);
                event.currentTarget.style.filter = `drop-shadow(0 0 6px ${link.glowColor})`;
            }}
            onMouseLeave={(event) => {
                setHovered(false);
                event.currentTarget.style.filter = 'none';
            }}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            className={`relative block text-text-secondary transition-colors duration-300 ${link.hoverColor}`}
        >
            {/* Only the glyph scales. The anchor keeps its box, so the hit area
                stays put, the row never reflows, and the measurement the
                magnification reads from can't feed back into itself. */}
            <motion.span className="block" style={active ? { scale, y } : undefined}>
                {link.icon}
            </motion.span>

            <AnimatePresence>
                {hovered && active && (
                    <motion.span
                        initial={{ opacity: 0, y: 2, scale: 0.9, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
                        exit={{ opacity: 0, y: 2, scale: 0.9, x: '-50%' }}
                        transition={SPRING_SWAP}
                        className="pointer-events-none absolute left-1/2 top-full z-50 mt-2.5 whitespace-nowrap rounded-md border border-border bg-[var(--overlay-surface)] px-2 py-1 text-[0.65rem] font-semibold text-text-primary shadow-[var(--overlay-shadow)] backdrop-blur-sm"
                    >
                        {link.label}
                    </motion.span>
                )}
            </AnimatePresence>
        </a>
    );
};

const SocialDock = ({ links = [], className = '' }) => {
    const reduce = useReducedMotion();
    const canHover = useHoverCapable();
    const mouseX = useMotionValue(null);
    const active = !reduce && canHover;

    if (!links.length) return null;

    return (
        <div
            className={`flex items-center gap-4 ${className}`}
            onMouseMove={(event) => active && mouseX.set(event.clientX)}
            onMouseLeave={() => mouseX.set(null)}
        >
            {links.map((link) => (
                <DockIcon key={link.label} link={link} mouseX={mouseX} active={active} />
            ))}
        </div>
    );
};

export default SocialDock;
