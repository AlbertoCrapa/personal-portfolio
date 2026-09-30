import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
    CARD_TAP_SCALE,
    EASE_OUT,
    SPRING_PRESS,
    SPRING_SWAP,
    useReducedMotion,
} from '../../../utils/motion';

/**
 * MediaRow — the index-row form of MediaCard.
 *
 * Used where a grid would waste vertical space: narrow screens, dense lists.
 * Same reading order as the card (eyebrow → title → blurb) so switching
 * between the two layouts never re-teaches the visitor where to look.
 */
const MediaRow = ({ to, thumb, title, eyebrow = [], description, trailing, className = '' }) => {
    const reduce = useReducedMotion();
    const [hovered, setHovered] = React.useState(false);
    const parts = eyebrow.filter(Boolean);

    return (
        <motion.div
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            whileTap={reduce ? undefined : { scale: CARD_TAP_SCALE }}
            transition={SPRING_PRESS}
        >
            <Link
                to={to}
                onFocus={() => setHovered(true)}
                onBlur={() => setHovered(false)}
                className={`group relative flex items-center gap-3.5 rounded-xl px-2.5 py-3 outline-offset-2 sm:gap-4 ${className}`}
            >
                <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-xl bg-surface"
                    animate={{ opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.22, ease: EASE_OUT }}
                />

                {thumb && (
                    <span className="relative z-10 h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-border sm:h-16 sm:w-24">
                        <motion.img
                            src={thumb}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            animate={{ scale: hovered ? 1.06 : 1 }}
                            transition={{ duration: 0.5, ease: EASE_OUT }}
                            className="h-full w-full object-cover"
                            onError={(event) => {
                                event.currentTarget.src = 'https://placehold.co/240x160/222222/6b6b6b?text=+';
                            }}
                        />
                    </span>
                )}

                <span className="relative z-10 min-w-0 flex-1">
                    {parts.length > 0 && (
                        <span className="mb-0.5 block truncate text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-text-muted">
                            <span className="text-text-primary">{parts[0]}</span>
                            {parts.length > 1 && <span className="font-medium">{`  ·  ${parts.slice(1).join('  ·  ')}`}</span>}
                        </span>
                    )}
                    <span className="block truncate font-display text-[0.95rem] font-bold leading-snug text-text-primary sm:text-base">
                        {title}
                    </span>
                    {description && (
                        <span className="mt-0.5 line-clamp-1 block text-sm text-text-secondary">
                            {description}
                        </span>
                    )}
                </span>

                <span className="relative z-10 flex flex-shrink-0 items-center gap-2">
                    {trailing}
                    <motion.span
                        aria-hidden="true"
                        className="text-text-muted"
                        animate={reduce ? undefined : { x: hovered ? 2 : 0, opacity: hovered ? 1 : 0.4 }}
                        transition={SPRING_SWAP}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <path d="M5 12h13M13 6l6 6-6 6" />
                        </svg>
                    </motion.span>
                </span>
            </Link>
        </motion.div>
    );
};

export default MediaRow;
