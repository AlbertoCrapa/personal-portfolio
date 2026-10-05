import React from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';

import { Card } from '../arc/card/card';
import Tag from './Tag';
import styles from './CollectionCard.module.css';

/**
 * CollectionCard — the one card for projects, playground entries and posts.
 *
 * Reading order: cover, title (two lines at most), blurb (three lines at most,
 * both ending in an ellipsis),
 * tags, then the byline (role and date, or date and read time).
 *
 * The whole card opens the detail page through one link stretched over it, the
 * same pattern Arc's card uses for its title. Because the card itself is not a
 * link, the controls inside it can be real controls of their own: each tag is
 * a link to the listing filtered by it, and `overlay` pins buttons (Start, open
 * in a new tab) to the cover's corner. A preview video plays over the cover
 * while the card is pointed at.
 *
 * Props:
 *   to          – detail route
 *   cover/video – media
 *   title, description
 *   tags        – up to three, plus "+n"
 *   tagTo       – (tag) => listing URL filtered by that tag
 *   meta        – byline parts, joined with a middle dot
 *   overlay     – node pinned to the cover's bottom-left corner
 *   compact     – cover and title only (small rail cards)
 */
const MAX_TAGS = 3;

const CollectionCard = ({ to, cover, video, title, description, tags = [], tagTo, meta = [], overlay, compact = false }) => {
    const reduce = useReducedMotion();
    const videoRef = React.useRef(null);
    const [active, setActive] = React.useState(false);
    const [videoReady, setVideoReady] = React.useState(false);
    // Keyboard position shows as the card's strong border, the cue Arc gives a
    // focused card title; there are no focus rings.
    const [focused, setFocused] = React.useState(false);
    const playPreview = Boolean(video) && !reduce;

    React.useEffect(() => {
        const el = videoRef.current;
        if (!el) return undefined;
        if (active) {
            // A preview that refuses to play must not blank the cover.
            el.play().catch(() => setVideoReady(false));
            return undefined;
        }
        el.pause();
        el.currentTime = 0;
        return undefined;
    }, [active]);

    const byline = meta.filter(Boolean).join(' · ');
    const shownTags = compact ? [] : tags.slice(0, MAX_TAGS);
    const hiddenTags = compact ? 0 : Math.max(0, tags.length - MAX_TAGS);

    const media = cover || video ? (
        <div className={styles.cover}>
            {cover && <img src={cover} alt="" loading="lazy" decoding="async" className={styles.image} />}
            {playPreview && (
                <video
                    ref={videoRef}
                    src={video}
                    muted
                    loop
                    playsInline
                    preload="none"
                    onCanPlay={() => setVideoReady(true)}
                    className={styles.video}
                    data-visible={(active && videoReady) || undefined}
                    aria-hidden="true"
                />
            )}
        </div>
    ) : undefined;

    return (
        <Card
            title={title}
            media={media}
            meta={byline || undefined}
            className={styles.card}
            style={{ height: '100%', borderColor: focused ? 'var(--border-strong)' : undefined }}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
        >
            <Link
                to={to}
                className={styles.stretched}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            >
                <span className={styles.srOnly}>{title}</span>
            </Link>

            {!compact && description && <p className={styles.description}>{description}</p>}

            {shownTags.length > 0 && (
                <ul className={styles.tags} aria-label="Tags">
                    {shownTags.map((tag) => (
                        <li key={tag}>
                            <Tag to={tagTo ? tagTo(tag) : undefined}>{tag}</Tag>
                        </li>
                    ))}
                    {hiddenTags > 0 && (
                        <li className={styles.more} aria-label={`${hiddenTags} more`}>
                            +{hiddenTags}
                        </li>
                    )}
                </ul>
            )}

            {overlay && media && (
                <div className={styles.overlayFrame}>
                    <div className={styles.overlay}>{overlay}</div>
                </div>
            )}
        </Card>
    );
};

export default CollectionCard;
