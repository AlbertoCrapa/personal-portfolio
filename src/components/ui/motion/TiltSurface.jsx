import React from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

import { SPRING_MOUSE, useHoverCapable, useReducedMotion } from '../../../utils/motion';

/**
 * TiltSurface — cursor-tracked 3D tilt with a glare that follows the pointer.
 *
 * Deliberately restrained compared to a showcase tilt card: 5° by default,
 * because a grid of twelve cards all tilting at 12° reads as noise. The tilt
 * is what makes a card feel like a physical object under the cursor; the glare
 * is what makes it feel like a *lit* one.
 *
 * Disabled outright on touch devices and under reduced motion — there is no
 * cursor to track, and the wrapper falls back to a plain div.
 *
 * Props:
 *   max      – peak rotation in degrees
 *   glare    – render the pointer-tracked highlight
 *   scale    – hover scale of the whole surface
 */
const TiltSurface = ({
    children,
    className = '',
    max = 5,
    glare = true,
    scale = 1,
    ...rest
}) => {
    const reduce = useReducedMotion();
    const canHover = useHoverCapable();
    const ref = React.useRef(null);

    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const glareX = useMotionValue(50);
    const glareY = useMotionValue(50);
    const glareOpacity = useMotionValue(0);

    const springRotateX = useSpring(rotateX, SPRING_MOUSE);
    const springRotateY = useSpring(rotateY, SPRING_MOUSE);
    const springGlareX = useSpring(glareX, SPRING_MOUSE);
    const springGlareY = useSpring(glareY, SPRING_MOUSE);

    const glareBackground = useMotionTemplate`radial-gradient(circle at ${springGlareX}% ${springGlareY}%, rgb(var(--glare-color) / var(--glare-opacity)), transparent 55%)`;

    const active = !reduce && canHover;

    const handleMove = (event) => {
        const el = ref.current;
        if (!el || !active) return;
        const rect = el.getBoundingClientRect();
        // Normalised 0→1 inside the card, recentred to -0.5→0.5 so the middle
        // of the card is the rest position.
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        rotateY.set((px - 0.5) * 2 * max);
        rotateX.set((0.5 - py) * 2 * max);
        glareX.set(px * 100);
        glareY.set(py * 100);
    };

    const handleLeave = () => {
        rotateX.set(0);
        rotateY.set(0);
        glareOpacity.set(0);
    };

    if (!active) {
        return (
            <div ref={ref} className={className} {...rest}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            ref={ref}
            className={className}
            onPointerMove={handleMove}
            onPointerEnter={() => glareOpacity.set(1)}
            onPointerLeave={handleLeave}
            whileHover={scale !== 1 ? { scale } : undefined}
            style={{
                rotateX: springRotateX,
                rotateY: springRotateY,
                transformPerspective: 1000,
                transformStyle: 'preserve-3d',
            }}
            {...rest}
        >
            {children}
            {glare && (
                <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
                    style={{ background: glareBackground, opacity: glareOpacity }}
                />
            )}
        </motion.div>
    );
};

export default TiltSurface;
