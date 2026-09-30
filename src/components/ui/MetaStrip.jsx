import React from 'react';
import { motion } from 'framer-motion';

import Icon from './Icon';
import Tag from './motion/Tag';
import {
    EASE_OUT,
    REVEAL_STAGGER,
    SPRING_PRESS,
    TAP_SCALE,
    useReducedMotion,
} from '../../utils/motion';

/**
 * MetaStrip — the facts under an article or project title.
 *
 * Deliberately *not* a panel. The previous version boxed every fact into its
 * own filled cell on a bordered card, which read as a dashboard widget dropped
 * onto an editorial page — heavier than the title it sat under. This is a
 * byline instead: one hairline rule, a single line of `label value` pairs
 * divided by thin rules, then the stack and the links as quiet labelled rows.
 *
 * Props:
 *   facts     – [{ label, value }]; falsy values are dropped
 *   tags      – [string] rendered as chips under a labelled row
 *   tagsLabel – label for that row (default "Stack")
 *   tagTo     – (tag) => path; makes each chip a link to a filtered listing
 *   highlight – { label, value } shown as an accented line
 *   links     – [{ label, url }] rendered as pressable pills
 *   aside     – node placed at the end of the tags row (e.g. an RSS link)
 *
 * A fact's icon comes from its label, so call sites stay plain data. An
 * unmapped label simply renders without one.
 */

const FACT_ICONS = {
    role: 'user',
    author: 'user',
    timeline: 'calendar',
    published: 'calendar',
    team: 'users',
    duration: 'clock',
    'reading time': 'clock',
    access: 'lock',
};

const RowLabel = ({ children }) => (
    <span className="mt-1 flex-shrink-0 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
        {children}
    </span>
);

const Cell = ({ label, value, index, reduce }) => {
    const icon = FACT_ICONS[String(label).toLowerCase()];

    return (
    <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
            reduce
                ? { duration: 0.2 }
                : { duration: 0.4, ease: EASE_OUT, delay: index * REVEAL_STAGGER }
        }
        // The icon carries the label — "role Technical Designer" spends a
        // third of the line on a word the glyph already says. With the words
        // gone the cells are short enough that spacing separates them;
        // dividing rules only stranded themselves at the start of a wrapped
        // line anyway.
        className="flex items-center gap-1.5"
    >
        <dt className="flex items-center gap-1.5 lowercase text-text-muted">
            {/* The glyph is the label; the words stay for screen readers —
                unless nothing maps to this label, where the word is all
                there is. */}
            <Icon name={icon} />
            <span className={icon ? 'sr-only' : ''}>{label}</span>
        </dt>
        <dd className="font-medium text-text-primary">{value}</dd>
    </motion.div>
    );
};

const MetaStrip = ({
    facts = [],
    tags = [],
    tagsLabel = 'Stack',
    tagTo,
    highlight,
    links = [],
    aside,
    className = '',
}) => {
    const reduce = useReducedMotion();
    const cells = facts.filter((fact) => fact && fact.value);
    const hasTags = tags.length > 0 || Boolean(aside);

    if (!cells.length && !hasTags && !highlight && !links.length) return null;

    return (
        <section className={`space-y-2.5 border-t border-border pt-3 sm:space-y-3.5 sm:pt-4 ${className}`} aria-label="Details">
            {cells.length > 0 && (
                <dl className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm">
                    {cells.map((fact, i) => (
                        <Cell key={fact.label} {...fact} index={i} reduce={reduce} />
                    ))}
                </dl>
            )}

            {highlight && (
                <p className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary">
                    <span className="mt-[3px] h-4 w-[3px] flex-shrink-0 rounded-full bg-accent-green" aria-hidden="true" />
                    <span>
                        <span className="font-semibold text-text-primary">{highlight.label}: </span>
                        {highlight.value}
                    </span>
                </p>
            )}

            {hasTags && (
                <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
                    {tags.length > 0 && <RowLabel>{tagsLabel}</RowLabel>}
                    <div className="flex min-w-0 flex-wrap gap-1.5 sm:flex-1">
                        {tags.map((tag, i) => (
                            <Tag key={tag} index={i} to={tagTo ? tagTo(tag) : undefined}>
                                {tag}
                            </Tag>
                        ))}
                    </div>
                    {aside}
                </div>
            )}

            {links.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    <RowLabel>Links</RowLabel>
                    {links.map((link, i) => (
                        <motion.a
                            key={`${link.url}-${i}`}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={reduce ? undefined : { y: -1 }}
                            whileTap={reduce ? undefined : { scale: TAP_SCALE }}
                            transition={SPRING_PRESS}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-semibold text-text-secondary hover:border-border-strong hover:text-text-primary"
                        >
                            {link.label || 'Link'}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                                <path d="M7 17 17 7M9 7h8v8" />
                            </svg>
                        </motion.a>
                    ))}
                </div>
            )}
        </section>
    );
};

export default MetaStrip;
