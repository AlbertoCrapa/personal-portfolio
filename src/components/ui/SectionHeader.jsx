import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { SPRING_SWAP, useReducedMotion } from '../../utils/motion';

/**
 * SectionHeader
 * Section title with an optional "see all" link.
 *
 * The rule under the title is a scroll-triggered wipe rather than a static
 * border: it draws in from the left as the section arrives, which gives every
 * section on the homepage the same opening beat.
 *
 * @param {string} title - Section title
 * @param {string} seeAllLink - Optional link target
 * @param {string} seeAllLabel - Optional link copy (default "see all")
 * @param {React.ReactNode} meta - Optional node rendered next to the title
 * @param {boolean} rule - Draw the underline (default true)
 */
const SectionHeader = ({
    title,
    seeAllLink,
    seeAllLabel = 'see all',
    meta,
    rule = true,
    className = '',
}) => {
    const reduce = useReducedMotion();
    const [hovered, setHovered] = React.useState(false);

    return (
        <div className={`mb-4 ${className}`}>
            <div className="flex items-end justify-between gap-4">
                <div className="flex items-baseline gap-3">
                    <h2 className="font-display text-lg font-bold tracking-tight text-text-primary md:text-xl">
                        {title}
                    </h2>
                    {meta}
                </div>

                {seeAllLink && (
                    <Link
                        to={seeAllLink}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        onFocus={() => setHovered(true)}
                        onBlur={() => setHovered(false)}
                        className="group flex flex-shrink-0 items-center gap-1.5 pb-0.5 text-sm text-text-muted transition-colors hover:text-text-primary"
                    >
                        {seeAllLabel}
                        <motion.span
                            aria-hidden="true"
                            animate={reduce ? undefined : { x: hovered ? 3 : 0 }}
                            transition={SPRING_SWAP}
                        >
                            →
                        </motion.span>
                    </Link>
                )}
            </div>

            {rule && (
                <motion.div
                    aria-hidden="true"
                    className="mt-2 h-px origin-left bg-border"
                    initial={reduce ? { opacity: 0 } : { scaleX: 0 }}
                    whileInView={reduce ? { opacity: 1 } : { scaleX: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
            )}
        </div>
    );
};

export default SectionHeader;
