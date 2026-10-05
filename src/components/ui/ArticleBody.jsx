import React from 'react';

import BeforeAfter from './BeforeAfter';
import MediaFrame from './MediaFrame';
import ModelViewer from './ModelViewer';
import RichText from './RichText';
import { toId } from './TableOfContents';
import {
    Aside,
    CalloutBlock,
    CodeFigure,
    Divider,
    Gallery,
    KeyPoints,
    Lead,
    PullQuote,
    Stats,
} from './article/blocks';
import { normalizeContent } from './article/normalize';
import styles from './article/article.module.css';

/**
 * ArticleBody — the single renderer behind /work/:slug, /playground/:slug and
 * /blog/:slug. Before this existed both pages carried their own ~90-line copy
 * of the same switch, so any new block type had to be written twice and the two
 * pages slowly drifted apart.
 *
 * It does two jobs:
 *
 *  1. Renders every block kind produced by `article/normalize`.
 *  2. Owns the vertical rhythm. This is the part that decides whether a page
 *     reads like an article or like a rendered database table. Uniform spacing
 *     between every element is the single strongest "generated" tell, so the
 *     gap above a block depends on what came before it: a paragraph hugs its
 *     heading, consecutive paragraphs sit close, a new section gets air.
 */

/** Figure widths. Every block shares one 48rem column; `wide` breaks it on
 *  large screens without reaching the table of contents, the smaller sizes
 *  are for portrait shots and diagrams that look silly stretched. */
const SIZE_CLASS = {
    wide: styles.sizeWide,
    inline: styles.sizeInline,
    small: styles.sizeSmall,
};

/** Gap above a block, as a function of (previous kind, this kind).
 *  '' keeps the section-level gap. */
function gapClass(prev, block) {
    if (!prev) return '';
    const from = prev.kind;
    const to = block.kind;

    if (from === 'divider' || to === 'divider') return styles.wideGap;

    if (from === 'heading') {
        // A heading and the text under it are one unit; anything else that
        // follows a heading (a figure, a stat row) still opens the section.
        return to === 'prose' || to === 'lead' || to === 'aside' ? styles.tight : styles.afterHeading;
    }

    if (to === 'heading') return block.level >= 3 ? styles.step : '';

    if (from === 'prose' && to === 'prose') return styles.close;
    if (from === 'lead' && to === 'prose') return styles.close;
    if (to === 'aside' || from === 'aside') return styles.aroundAside;

    return '';
}

const HEADING_CLASS = {
    2: `${styles.heading} ${styles.heading2}`,
    3: `${styles.heading} ${styles.heading3}`,
    4: `${styles.heading} ${styles.heading4}`,
};

/** Media blocks predate Arc and must render exactly as they always have, so
 *  they sit in a legacy zone that restores their type, ink and focus rings. */
const MEDIA_KINDS = new Set(['media', 'gallery', 'model', 'compare']);

const isVideoSrc = (src) => (src ? /\.(mp4|webm|mov)$/i.test(src) : false);

function renderBlock(block, key, context) {
    const { title } = context;

    switch (block.kind) {
        case 'heading': {
            const Tag = `h${block.level}`;
            return (
                <Tag key={key} id={block.level === 2 ? toId(block.text) : undefined} className={HEADING_CLASS[block.level]}>
                    {block.text}
                </Tag>
            );
        }

        case 'lead':
            return <Lead key={key} text={block.text} />;

        case 'prose':
            return <RichText key={key} text={block.text} />;

        case 'quote':
            return <PullQuote key={key} text={block.text} cite={block.cite} />;

        case 'callout':
            return <CalloutBlock key={key} text={block.text} variant={block.variant} title={block.title} />;

        case 'keyPoints':
            return <KeyPoints key={key} title={block.title} items={block.items} />;

        case 'stats':
            return <Stats key={key} items={block.items} />;

        case 'aside':
            return <Aside key={key} title={block.title} text={block.text} />;

        case 'divider':
            return <Divider key={key} />;

        case 'media':
            return (
                <MediaFrame
                    key={key}
                    src={block.src}
                    isVideo={isVideoSrc(block.src)}
                    poster={block.poster}
                    alt={block.alt || block.caption || `${title} media`}
                    description={block.caption}
                    allowFullscreen={block.allowFullscreen}
                />
            );

        case 'gallery':
            return (
                <Gallery
                    key={key}
                    items={block.items}
                    columns={block.columns}
                    caption={block.caption}
                    allowFullscreen={block.allowFullscreen}
                    isVideo={isVideoSrc}
                />
            );

        case 'model':
            return (
                <ModelViewer
                    key={key}
                    src={block.src}
                    poster={block.poster}
                    alt={block.alt || block.caption || `${title} 3D model`}
                    description={block.caption}
                    className="w-full h-[280px] sm:h-[340px] md:h-[420px]"
                />
            );

        case 'compare':
            return (
                <BeforeAfter
                    key={key}
                    before={block.before}
                    after={block.after}
                    description={block.caption}
                    startAt={block.startAt}
                />
            );

        case 'code':
            return (
                <CodeFigure
                    key={key}
                    code={block.code}
                    language={block.language}
                    caption={block.caption}
                    filename={block.filename}
                />
            );

        default:
            return null;
    }
}

/**
 * Props:
 *   content   raw `content` array from JSON (any supported authoring shape)
 *   blocks    already-normalized blocks (pass this if the page also needs the
 *             ToC, so normalization only happens once)
 *   title     article title, used for media alt-text fallbacks
 *   skipMediaSrc  a media src already shown as the page cover — rendered once,
 *                 at the top of the page, so the body must not repeat it
 */
const ArticleBody = ({ content, blocks, title = '', skipMediaSrc = null, className = '' }) => {
    const normalized = blocks || normalizeContent(content);
    if (!normalized.length) return null;

    let skipped = false;
    const visible = normalized.filter((block) => {
        if (!skipped && block.kind === 'media' && block.src === skipMediaSrc) {
            skipped = true;
            return false;
        }
        return true;
    });

    return (
        <div className={`${styles.body} ${className}`.trim()}>
            {visible.map((block, idx) => {
                const prev = visible[idx - 1];
                const classes = [styles.block, SIZE_CLASS[block.size], gapClass(prev, block), MEDIA_KINDS.has(block.kind) && 'legacy-zone']
                    .filter(Boolean)
                    .join(' ');
                return (
                    <div key={idx} className={classes}>
                        {renderBlock(block, idx, { title })}
                    </div>
                );
            })}
        </div>
    );
};

export default ArticleBody;
