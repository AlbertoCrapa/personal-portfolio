import React from 'react';

import Callout from '../Callout';
import MediaFrame from '../MediaFrame';
import RichText from '../RichText';

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
export const Lead = ({ text }) => (
    <RichText
        text={text}
        className="[&>p]:text-lg md:[&>p]:text-xl [&>p]:leading-relaxed [&>p]:text-text-primary/85"
    />
);

/* ── Pull quote ────────────────────────────────────────────────────────────
   One sentence, promoted. Use it for the claim a reader should leave with,
   not for a quote from somebody else (that is what `cite` is for). */
export const PullQuote = ({ text, cite }) => (
    <figure className="border-l-2 border-accent-orange pl-5 md:pl-7">
        <blockquote className="font-display text-xl md:text-2xl leading-snug text-text-primary">
            {inline(text)}
        </blockquote>
        {cite && (
            <figcaption className="mt-3 text-sm text-text-muted">
                <span className="mr-1">—</span>{inline(cite)}
            </figcaption>
        )}
    </figure>
);

/* ── Key points ────────────────────────────────────────────────────────────
   A boxed, scannable list: "what this covers" near the top, or "what I'd do
   differently" at the end. Deliberately capped at a handful of lines. */
export const KeyPoints = ({ title, items }) => (
    <aside className="rounded-xl border border-border bg-surface/40 p-5 md:p-6">
        {title && (
            <p className="text-sm font-medium text-text-secondary mb-3">{title}</p>
        )}
        <ul className="space-y-2.5">
            {items.map((item, i) => (
                <li key={i} className="flex gap-3 text-text-secondary leading-relaxed">
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 mt-1 flex-shrink-0 text-white">
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
    <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-px bg-border rounded-xl overflow-hidden border border-border">
        {items.map((stat, i) => (
            <div key={i} className="bg-bg px-4 py-4 md:py-5">
                <p className="font-display text-2xl md:text-3xl text-text-primary leading-none">
                    {stat.value}
                </p>
                {stat.label && (
                    <p className="mt-1.5 text-sm text-text-muted">{stat.label}</p>
                )}
                {stat.hint && <p className="mt-1 text-xs text-text-muted/80">{stat.hint}</p>}
            </div>
        ))}
    </div>
);

/* ── Aside ─────────────────────────────────────────────────────────────────
   The remark you would otherwise bury in parentheses. Smaller type marks it
   as skippable, which is exactly what makes the main line easier to follow. */
export const Aside = ({ title, text }) => (
    <aside className="border-l border-border pl-4 md:pl-5 text-sm">
        {title && <p className="text-text-primary font-medium mb-1">{title}</p>}
        <RichText
            text={text}
            className="[&>p]:text-sm [&>p]:text-text-muted [&>ul]:text-sm [&>ol]:text-sm"
        />
    </aside>
);

/* ── Callout block ─────────────────────────────────────────────────────────
   Same component the `:::info` markdown fence uses, exposed as a block so it
   can carry a title and be dropped between two paragraphs. */
export const CalloutBlock = ({ text, variant, title }) => (
    <Callout type={variant === 'warning' ? 'warning' : 'info'}>
        {title && <p className="font-semibold text-text-primary mb-1">{title}</p>}
        <RichText text={text} className="space-y-2 [&>p]:text-sm [&>p]:text-text-primary/90" />
    </Callout>
);

/* ── Divider ───────────────────────────────────────────────────────────────
   A scene break, not a section break. Three dots read as "time passes";
   a full rule reads as "new document". */
export const Divider = () => (
    <div className="flex items-center justify-center gap-2 py-2" role="separator" aria-hidden="true">
        {[0, 1, 2].map((i) => (
            <span key={i} className="w-1 h-1 rounded-full bg-text-muted/60" />
        ))}
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
    <figure className="space-y-2">
        {filename && (
            <p className="text-xs font-mono text-text-muted">{filename}</p>
        )}
        <RichText text={`\`\`\`${language}\n${code}\n\`\`\``} className="!space-y-0 [&>div]:!my-0" />
        {caption && <figcaption className="text-sm text-text-muted">{caption}</figcaption>}
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
        <RichText
            text={text}
            className="!inline !space-y-0 [&>p]:!inline [&>p]:!text-inherit [&>p]:!leading-[inherit] [&>p]:!m-0"
        />
    );
}
