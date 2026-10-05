import React from 'react';

import Callout from '../Callout';
import MediaFrame from '../MediaFrame';
import RichText from '../RichText';
import styles from './article.module.css';

/**
 * The small presentational blocks an article can use besides prose and media.
 *
 * They exist for one reason: an article that only has headings and paragraphs
 * has a single texture, and a single texture reads as generated. Each block
 * here is a different *density* of information — a lead is slower, a stat row
 * is instant, a pull quote is a beat of silence — so the page gets a rhythm.
 */

/* ── Lead ──────────────────────────────────────────────────────────────────
   The opening paragraph, one size up. Says what the thing is and why it was
   hard, before any heading has had a chance to interrupt. */
export const Lead = ({ text }) => <RichText text={text} className={styles.lead} />;

/* ── Pull quote ────────────────────────────────────────────────────────────
   One sentence, promoted. Use it for the claim a reader should leave with,
   not for a quote from somebody else (that is what `cite` is for). */
export const PullQuote = ({ text, cite }) => (
    <figure className={styles.pullQuote}>
        <blockquote className={styles.pullQuoteText}>
            {inline(text)}
        </blockquote>
        {cite && <figcaption className={styles.pullQuoteCite}>{inline(cite)}</figcaption>}
    </figure>
);

/* ── Key points ────────────────────────────────────────────────────────────
   A boxed, scannable list: "what this covers" near the top, or "what I'd do
   differently" at the end. Deliberately capped at a handful of lines. */
export const KeyPoints = ({ title, items }) => (
    <aside className={styles.keyPoints}>
        {title && <p className={styles.keyPointsTitle}>{title}</p>}
        <ul className={styles.keyPointsList}>
            {items.map((item, i) => (
                <li key={i} className={styles.keyPoint}>
                    <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
                        <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{inline(item)}</span>
                </li>
            ))}
        </ul>
    </aside>
);

/* ── Stats ─────────────────────────────────────────────────────────────────
   Concrete numbers are the cheapest credibility in technical writing, and a
   row of them gives the eye somewhere to land between two blocks of prose. */
export const Stats = ({ items }) => (
    <div className={styles.stats}>
        {items.map((stat, i) => (
            <div key={i} className={styles.stat}>
                <p className={styles.statValue}>{stat.value}</p>
                {stat.label && <p className={styles.statLabel}>{stat.label}</p>}
                {stat.hint && <p className={styles.statHint}>{stat.hint}</p>}
            </div>
        ))}
    </div>
);

/* ── Aside ─────────────────────────────────────────────────────────────────
   The remark you would otherwise bury in parentheses. Smaller type marks it
   as skippable, which is exactly what makes the main line easier to follow. */
export const Aside = ({ title, text }) => (
    <aside className={styles.aside}>
        {title && <p className={styles.asideTitle}>{title}</p>}
        <RichText text={text} />
    </aside>
);

/* ── Callout block ─────────────────────────────────────────────────────────
   Same component the `:::info` markdown fence uses, exposed as a block so it
   can carry a title and be dropped between two paragraphs. */
export const CalloutBlock = ({ text, variant, title }) => (
    <Callout type={variant === 'warning' ? 'warning' : 'info'}>
        {title && <p className={styles.calloutTitle}>{title}</p>}
        <RichText text={text} />
    </Callout>
);

/* ── Divider ───────────────────────────────────────────────────────────────
   A scene break, not a section break. Three dots read as "time passes";
   a full rule reads as "new document". */
export const Divider = () => (
    <div className={styles.divider} role="separator" aria-hidden="true">
        {[0, 1, 2].map((i) => <span key={i} />)}
    </div>
);

/* ── Gallery ───────────────────────────────────────────────────────────────
   Two or three figures that only mean something next to each other. Each keeps
   its own caption; the group caption explains what the comparison is for. */
export const Gallery = ({ items, columns = 2, caption, allowFullscreen = true, isVideo }) => (
    <figure className="space-y-3">
        <div
            className="grid gap-3 sm:gap-4"
            style={{ gridTemplateColumns: `repeat(${Math.min(columns, items.length)}, minmax(0, 1fr))` }}
        >
            {items.map((item, i) => (
                <MediaFrame
                    key={i}
                    src={item.src}
                    isVideo={isVideo(item.src)}
                    alt={item.alt || item.caption || ''}
                    description={item.caption}
                    allowFullscreen={allowFullscreen}
                />
            ))}
        </div>
        {caption && (
            <figcaption className="text-sm text-text-muted text-center">{caption}</figcaption>
        )}
    </figure>
);

/* ── Code figure ───────────────────────────────────────────────────────────
   Delegates to RichText's fenced-code renderer (highlighting + copy button)
   and adds the caption that explains why the snippet is worth reading. */
export const CodeFigure = ({ code, language = 'text', caption, filename }) => (
    <figure className={styles.codeFigure}>
        {filename && <p className={styles.filename}>{filename}</p>}
        <RichText text={`\`\`\`${language}\n${code}\n\`\`\``} />
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
);

/**
 * Inline-only markdown for the one-line blocks (quote, key point).
 * RichText owns block-level parsing; here a <p> wrapper would fight the
 * component's own typography, so we render the string through RichText and
 * strip its paragraph styling instead of re-implementing the parser.
 */
function inline(text) {
    return (
        <RichText text={text} className={styles.inline} />
    );
}
