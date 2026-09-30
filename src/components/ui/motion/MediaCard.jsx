import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import TiltSurface from './TiltSurface';
import {
    CARD_TAP_SCALE,
    EASE_OUT,
    SPRING_PRESS,
    SPRING_SWAP,
    useHoverCapable,
    useReducedMotion,
} from '../../../utils/motion';

/**
 * MediaCard — the single card the whole site uses.
 *
 * The old cards stacked four competing blocks under the cover (title, blurb,
 * chip soup, an orphan duration line) and every one of them was the same
 * weight, so nothing led. This one has exactly one reading order:
 *
 *   eyebrow  → what it is, in micro type          (role · duration, or date · read time)
 *   title    → the thing itself, the only big text
 *   blurb    → two lines, capped
 *   footer   → the stack, as one row of chips (never more than one row)
 *
 * The chrome earns its weight through motion instead of borders: the card
 * lifts and tilts under the cursor, the cover pushes in, and the corner arrow
 * commits to the direction of travel. Everything degrades to a plain link on
 * touch and under reduced motion.
 *
 * Props:
 *   to / href    – internal route or external URL
 *   cover        – image src; video plays over it on hover when `video` is set
 *   eyebrow      – array of short strings, joined with a separator dot
 *   footer       – array of short strings (the stack), shown as one row of chips
 *   footerMore   – count of hidden footer entries, rendered as "+n"
 *   badge        – node pinned to the cover's bottom-left (e.g. a Start button)
 *   accent       – hex used for the cover's hover glow
 *   size         – 'large' | 'medium' | 'small' | 'list'
 *
 * The root is `h-full` so cards in one grid row share a height. That only works
 * when the parent is a cell meant to stretch — put a card in a plain column and
 * give that column `self-start`, or it will inherit the whole column's height.
 */

const COVER_ASPECT = {
    // `wide` fills its grid column instead of holding a ratio, so the card's
    // height comes from the text beside it rather than from the image.
    wide: 'aspect-[16/9] sm:aspect-auto sm:h-full',
    large: 'aspect-[16/9]',
    medium: 'aspect-[16/9]',
    small: 'aspect-[16/9]',
};

const TITLE_SIZE = {
    wide: 'text-lg md:text-xl',
    large: 'text-xl md:text-2xl',
    medium: 'text-base md:text-lg',
    small: 'text-sm md:text-[0.95rem]',
};

const ArrowIcon = ({ className = '' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M7 17 17 7M9 7h8v8" />
    </svg>
);

const Eyebrow = ({ parts = [] }) => {
    const items = parts.filter(Boolean);
    if (!items.length) return null;
    return (
        <p className="flex flex-wrap items-center gap-x-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-text-muted">
            {items.map((part, i) => (
                <React.Fragment key={`${part}-${i}`}>
                    {i > 0 && <span aria-hidden="true" className="h-3 w-px bg-border-strong" />}
                    {/* The lead part (role, or date) is the one a glance
                        should catch; the rest stays a step quieter. */}
                    <span className={i === 0 ? 'text-text-primary' : 'font-medium'}>{part}</span>
                </React.Fragment>
            ))}
        </p>
    );
};

/* ── Cover ─────────────────────────────────────────────────────────────── */

const Cover = ({ cover, video, alt, hovered, aspect, badge, accent, size }) => {
    const videoRef = React.useRef(null);
    const [videoReady, setVideoReady] = React.useState(false);

    React.useEffect(() => {
        const el = videoRef.current;
        if (!el) return;
        if (hovered) {
            // A preview that refuses to play (autoplay policy, decode error)
            // must not blank the cover, so the image stays underneath.
            el.play().catch(() => setVideoReady(false));
        } else {
            el.pause();
            el.currentTime = 0;
        }
    }, [hovered]);

    if (!cover && !video) return null;

    return (
        <div className={`relative overflow-hidden ${aspect} bg-bg`}>
            <motion.img
                src={cover}
                alt={alt}
                loading="lazy"
                decoding="async"
                animate={{
                    scale: hovered ? 1.05 : 1,
                    opacity: video && hovered && videoReady ? 0 : 1,
                }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                className="h-full w-full object-cover"
                onError={(event) => {
                    event.currentTarget.src = 'https://placehold.co/800x500/222222/6b6b6b?text=+';
                }}
            />

            {video && (
                <motion.video
                    ref={videoRef}
                    src={video}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onCanPlay={() => setVideoReady(true)}
                    animate={{ opacity: hovered && videoReady ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: EASE_OUT }}
                    className="absolute inset-0 h-full w-full object-cover"
                />
            )}

            {/* Scrim: always present so a badge stays legible, deepened on hover.
                It fades to the card's own surface, not the page canvas, so the
                cover dissolves into the panel below it in either theme. */}
            <motion.div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-2/5"
                style={{ background: 'linear-gradient(to top, rgb(var(--rgb-surface) / 0.9), transparent)' }}
                animate={{ opacity: hovered ? 0.3 : 0.35 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
            />

            {accent && (
                <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{ background: `radial-gradient(120% 90% at 50% 120%, ${accent}14, transparent 70%)` }}
                    animate={{ opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: EASE_OUT }}
                />
            )}

            {badge && (
                <div className={`absolute z-20 ${size === 'small' ? 'bottom-2 left-2' : 'bottom-3 left-3'}`}>
                    {badge}
                </div>
            )}
        </div>
    );
};

/* ── Card ──────────────────────────────────────────────────────────────── */

const MediaCard = ({
    to,
    href,
    cover,
    video,
    title,
    eyebrow = [],
    description,
    footer = [],
    footerMore = 0,
    badge,
    accent,
    size = 'medium',
    className = '',
}) => {
    const reduce = useReducedMotion();
    const canHover = useHoverCapable();
    const [hovered, setHovered] = React.useState(false);

    // `wide` puts the cover beside the copy instead of above it. A stacked
    // hero card is ~480px tall and pushes everything under it off the screen;
    // side by side it lands around 260px, which is what lets the featured
    // block and the rail next to it end on the same line.
    const isSplit = size === 'wide';
    const showDescription = size !== 'small' && Boolean(description);
    const showFooter = size !== 'small' && footer.length > 0;

    const body = (
        <TiltSurface
            max={size === 'large' ? 4 : 5}
            className={`relative h-full overflow-hidden rounded-2xl bg-surface shadow-[var(--card-shadow)] ${isSplit
                ? 'grid sm:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]'
                : 'flex flex-col'
                }`}
        >
            {/* The border lives on its own layer so it can brighten without the
                1px reflow a border-colour transition on the card itself causes
                inside a CSS grid. */}
            <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20 rounded-2xl border"
                animate={{
                    borderColor: hovered
                        ? 'rgb(var(--rgb-border-strong))'
                        : 'rgb(var(--rgb-border))',
                }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
            />

            <Cover
                cover={cover}
                video={video}
                alt={title}
                hovered={hovered && canHover}
                aspect={COVER_ASPECT[size] || COVER_ASPECT.medium}
                badge={badge}
                accent={accent}
                size={size}
            />

            <div
                className={`flex flex-1 flex-col gap-2 ${size === 'small' ? 'p-3' : 'p-4 md:p-5'} ${isSplit ? 'justify-center' : ''
                    }`}
            >
                <Eyebrow parts={eyebrow} />

                <div className="flex items-start gap-3">
                    <h3
                        className={`min-w-0 flex-1 font-display font-bold leading-snug tracking-tight text-text-primary ${TITLE_SIZE[size] || TITLE_SIZE.medium
                            }`}
                    >
                        {title}
                    </h3>
                    <motion.span
                        aria-hidden="true"
                        className="mt-0.5 flex-shrink-0 text-text-muted"
                        animate={
                            reduce
                                ? undefined
                                : { x: hovered ? 2 : 0, y: hovered ? -2 : 0, opacity: hovered ? 1 : 0.45 }
                        }
                        transition={SPRING_SWAP}
                    >
                        <ArrowIcon className={size === 'small' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
                    </motion.span>
                </div>

                {showDescription && (
                    <p className="line-clamp-2 text-sm leading-relaxed text-text-secondary">
                        {description}
                    </p>
                )}

                {showFooter && (
                    <div className="mt-auto flex min-h-[1.75rem] items-center gap-2 border-t border-border pt-3">
                        {/* Fixed to one chip's height with wrapping on, so a
                            chip that doesn't fit drops to a hidden second row
                            instead of being cut in half. */}
                        <ul className="flex h-[1.375rem] min-w-0 flex-1 flex-wrap gap-1.5 overflow-hidden">
                            {footer.map((tag) => (
                                <li
                                    key={tag}
                                    // Same shape as <Tag> (the site's one chip), minus its
                                    // entrance/layout motion — three more animated
                                    // nodes per card is what the grid can't afford.
                                    className="inline-flex items-center whitespace-nowrap rounded-full border border-border-strong bg-bg px-2.5 py-1 text-xs leading-none text-text-primary"
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                        {footerMore > 0 && (
                            <span className="flex-shrink-0 text-xs font-semibold leading-none tabular-nums text-text-muted">
                                +{footerMore}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </TiltSurface>
    );

    const interactionProps = {
        onHoverStart: () => setHovered(true),
        onHoverEnd: () => setHovered(false),
        onFocus: () => setHovered(true),
        onBlur: () => setHovered(false),
        whileHover: reduce || !canHover ? undefined : { y: -4 },
        whileTap: reduce ? undefined : { scale: CARD_TAP_SCALE },
        transition: SPRING_PRESS,
        className: `block h-full rounded-2xl outline-offset-4 ${className}`,
    };

    if (href) {
        return (
            <motion.a href={href} target="_blank" rel="noopener noreferrer" {...interactionProps}>
                {body}
            </motion.a>
        );
    }

    return (
        <motion.div {...interactionProps}>
            <Link to={to} className="block h-full rounded-2xl">
                {body}
            </Link>
        </motion.div>
    );
};

export default MediaCard;
