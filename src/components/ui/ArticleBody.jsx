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

/** Reading measure. The whole column is one line away from a narrower one:
 *  '48rem' is today's width (~95 characters); 'max-w-[68ch]' would land in the
 *  65–75 character range typographers recommend for long-form reading. Changing
 *  it here changes every project and post at once — see CONTENT-GUIDE.md. */
const MEASURE = 'max-w-3xl';

/** Figure widths. `wide` breaks the column on large screens without ever
 *  reaching the table of contents; the smaller sizes are for portrait shots
 *  and diagrams that look silly stretched to full width. */
const SIZE_CLASS = {
    full: MEASURE,
    wide: `${MEASURE} lg:max-w-none lg:-mx-8`,
    inline: 'max-w-md mx-auto',
    small: 'max-w-sm mx-auto',
};

/** Gap above a block, as a function of (previous kind, this kind).
 *  '' means "inherit the container's space-y", i.e. the section-level gap. */
const TIGHT = '!mt-2 md:!mt-4';   // heading -> its own body
const CLOSE = '!mt-4';            // paragraph -> paragraph
const STEP = '!mt-6 md:!mt-8';    // sub-heading -> new beat inside a section
const WIDE = '!mt-10 md:!mt-12';  // around a scene break

function gapClass(prev, block) {
    if (!prev) return '';
    const from = prev.kind;
    const to = block.kind;

    if (from === 'divider' || to === 'divider') return WIDE;

    if (from === 'heading') {
        // A heading and the text under it are one unit; anything else that
        // follows a heading (a figure, a stat row) still opens the section.
        return to === 'prose' || to === 'lead' || to === 'aside' ? TIGHT : '!mt-4 md:!mt-6';
    }

    if (to === 'heading') return block.level >= 3 ? STEP : '';

    if (from === 'prose' && to === 'prose') return CLOSE;
    if (from === 'lead' && to === 'prose') return CLOSE;
    if (to === 'aside' || from === 'aside') return '!mt-5 md:!mt-6';

    return '';
}

const HEADING_CLASS = {
    2: 'text-2xl font-bold text-text-primary',
    3: 'text-lg md:text-xl font-semibold text-text-primary',
    4: 'text-base md:text-lg font-semibold text-text-secondary',
};

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
        <div className={`space-y-8 md:space-y-10 ${className}`}>
            {visible.map((block, idx) => {
                const prev = visible[idx - 1];
                const width = SIZE_CLASS[block.size] || MEASURE;
                return (
                    <div key={idx} className={`${width} ${gapClass(prev, block)}`.trim()}>
                        {renderBlock(block, idx, { title })}
                    </div>
                );
            })}
        </div>
    );
};

export default ArticleBody;
