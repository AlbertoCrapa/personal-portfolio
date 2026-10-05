import React from 'react';
import { ArrowUpRight, CalendarDays, Clock, Lock, User, Users } from 'lucide-react';

import Tag from './Tag';
import styles from './MetaStrip.module.css';

/**
 * MetaStrip — the facts under an article or project title.
 *
 * A byline, not a panel: one hairline, the facts as icon and value pairs, an
 * optional outcome line, then labelled rows for the tags and the links. Each
 * tag is a real link to the listing filtered by it (`tagTo`).
 *
 * Props:
 *   facts     – [{ label, value }]; empty values are dropped
 *   highlight – { label, value } shown as its own line
 *   tags      – [string]
 *   tagsLabel – label for the tag row
 *   tagTo     – (tag) => path
 *   links     – [{ label, url }]
 *   aside     – node at the end of the tag row (e.g. the RSS link)
 */
const ICON = { size: 16, strokeWidth: 1.75, 'aria-hidden': true };
const FACT_ICONS = {
    role: User,
    author: User,
    timeline: CalendarDays,
    published: CalendarDays,
    team: Users,
    duration: Clock,
    'reading time': Clock,
    access: Lock,
};

const MetaStrip = ({ facts = [], highlight, tags = [], tagsLabel = 'Stack', tagTo, links = [], aside }) => {
    const cells = facts.filter((fact) => fact && fact.value);
    if (!cells.length && !tags.length && !highlight && !links.length && !aside) return null;

    return (
        <section className={styles.strip} aria-label="Details">
            {cells.length > 0 && (
                <dl className={styles.facts}>
                    {cells.map(({ label, value }) => {
                        const Icon = FACT_ICONS[String(label).toLowerCase()];
                        return (
                            <div key={label} className={styles.fact}>
                                <dt className={styles.term}>
                                    {Icon && <Icon {...ICON} />}
                                    <span className={Icon ? styles.srOnly : undefined}>{label}</span>
                                </dt>
                                <dd className={styles.value}>{value}</dd>
                            </div>
                        );
                    })}
                </dl>
            )}

            {highlight && (
                <p className={styles.highlight}>
                    <span className={styles.highlightLabel}>{highlight.label}</span>
                    {highlight.value}
                </p>
            )}

            {(tags.length > 0 || aside) && (
                <div className={styles.row}>
                    {tags.length > 0 && <span className={styles.rowLabel}>{tagsLabel}</span>}
                    <ul className={styles.tags}>
                        {tags.map((tag) => (
                            <li key={tag}>
                                <Tag to={tagTo ? tagTo(tag) : undefined}>{tag}</Tag>
                            </li>
                        ))}
                    </ul>
                    {aside}
                </div>
            )}

            {links.length > 0 && (
                <div className={styles.row}>
                    <span className={styles.rowLabel}>Links</span>
                    <ul className={styles.tags}>
                        {links.map((link, i) => (
                            <li key={`${link.url}-${i}`}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.external}>
                                    {link.label || 'Open link'}
                                    <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
};

export default MetaStrip;
