import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import Breadcrumb from './Breadcrumb';
import VideoPlayer from './VideoPlayer';
import ArticleBody from './ArticleBody';
import TableOfContents from './TableOfContents';
import { Badge } from '../arc/badge/badge';
import styles from './ArticleLayout.module.css';

/**
 * ArticleLayout — the shared page for a project, an experiment or a post.
 *
 * Breadcrumb, cover, then the header (h1 with an optional type badge, one line
 * of context, an optional primary link, and the facts), then the article with
 * the table of contents beside it, then previous and next.
 *
 * The cover video, the media inside the article and the table of contents
 * predate Arc and render exactly as before: they sit in `.legacy-zone`. The
 * ToC keeps its original place as the second child of the article row.
 */
const isVideo = (src) => (src ? /\.(mp4|webm|mov)$/i.test(src) : false);

const Adjacent = ({ item, direction }) => {
    if (!item) return <span aria-hidden="true" />;
    const next = direction === 'next';
    return (
        <Link to={item.to} className={next ? `${styles.adjacent} ${styles.next}` : styles.adjacent}>
            <span className={styles.adjacentLabel}>
                {!next && <ArrowLeft size={14} strokeWidth={1.75} aria-hidden="true" />}
                {next ? 'Next' : 'Previous'}
                {next && <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />}
            </span>
            <span className={styles.adjacentTitle}>{item.title}</span>
        </Link>
    );
};

const ArticleLayout = ({
    breadcrumb = [],
    cover,
    poster,
    title,
    badge,
    subtitle,
    action,
    meta,
    blocks,
    skipMediaSrc,
    tocSections = [],
    previous,
    next,
}) => (
    <article className={styles.page}>
        <Breadcrumb items={breadcrumb} />

        {cover && (
            <div className={`legacy-zone ${styles.cover}`}>
                {isVideo(cover) ? (
                    <VideoPlayer src={cover} poster={poster} className="w-full h-full" pauseOffscreen={false} />
                ) : (
                    <img src={cover} alt="" className={styles.coverImage} />
                )}
            </div>
        )}

        <header className={styles.header}>
            <div className={styles.heading}>
                <div className={styles.titleRow}>
                    <h1 className={styles.title}>{title}</h1>
                    {badge && <Badge>{badge}</Badge>}
                </div>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
            {meta}
        </header>

        <div className={styles.columns} data-reveal="flat">
            <div className={styles.main}>
                <ArticleBody blocks={blocks} title={title} skipMediaSrc={skipMediaSrc} />

                {(previous || next) && (
                    <nav className={styles.pager} aria-label="More to read">
                        <Adjacent item={previous} direction="previous" />
                        <Adjacent item={next} direction="next" />
                    </nav>
                )}
            </div>
            <div className="legacy-zone legacy-zone--contents">
                <TableOfContents sections={tocSections} />
            </div>
        </div>
    </article>
);

export default ArticleLayout;
