import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import RevealSection from '../../components/ui/RevealSection';
import PageHeader from '../../components/ui/PageHeader';
import BlogCard from '../../components/ui/BlogCard';
import FilterBar from '../../components/ui/FilterBar';
import ResultsGrid from '../../components/ui/ResultsGrid';
import TiltSurface from '../../components/ui/motion/TiltSurface';
import Tag from '../../components/ui/motion/Tag';
import { useCollectionFilter } from '../../hooks/useCollectionFilter';
import {
    CARD_TAP_SCALE,
    EASE_OUT,
    SPRING_PRESS,
    SPRING_SWAP,
    useHoverCapable,
    useReducedMotion,
} from '../../utils/motion';
import { estimateReadTime, formatDate } from '../../utils/utils';
import blogData from '../../data/blog.json';

/**
 * Blog List Page — editorial layout.
 *
 * The newest post gets a wide split hero (cover beside the copy) so it reads
 * as the lead article rather than "the same card, bigger"; everything else
 * runs through the shared filtered grid. The hero steps aside as soon as a
 * filter is active — a lead article that ignores your search is noise.
 */

/* ── Lead article ───────────────────────────────────────────────────────── */

const FeaturedPost = ({ blog }) => {
    const reduce = useReducedMotion();
    const canHover = useHoverCapable();
    const [hovered, setHovered] = React.useState(false);

    const cover = blog.cover || blog.media?.[0]?.src;
    const tags = (blog.tags || []).slice(0, 3);

    return (
        <motion.div
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            whileHover={reduce || !canHover ? undefined : { y: -4 }}
            whileTap={reduce ? undefined : { scale: CARD_TAP_SCALE }}
            transition={SPRING_PRESS}
        >
            <Link
                to={`/blog/${blog.slug}`}
                onFocus={() => setHovered(true)}
                onBlur={() => setHovered(false)}
                className="block rounded-2xl outline-offset-4"
            >
                <TiltSurface
                    max={3}
                    className="relative grid overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--card-shadow)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"
                >
                    {cover && (
                        <div className="relative aspect-[16/9] overflow-hidden lg:aspect-auto lg:h-full">
                            <motion.img
                                src={cover}
                                alt={blog.title}
                                animate={{ scale: hovered && canHover ? 1.04 : 1 }}
                                transition={{ duration: 0.7, ease: EASE_OUT }}
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                    event.currentTarget.src = 'https://placehold.co/1200x700/222222/6b6b6b?text=+';
                                }}
                            />
                            {/* Fades the cover into the copy panel on wide screens,
                                and into the copy *below* it on narrow ones. */}
                            <div
                                aria-hidden="true"
                                className="absolute inset-0"
                                style={{
                                    background:
                                        'linear-gradient(to top, rgb(var(--rgb-surface) / 0.9), transparent 45%)',
                                }}
                            />
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 hidden lg:block"
                                style={{
                                    background:
                                        'linear-gradient(to right, transparent 55%, rgb(var(--rgb-surface) / 0.95))',
                                }}
                            />
                        </div>
                    )}

                    <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 lg:p-10">
                        <p className="flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-green" aria-hidden="true" />
                            Latest
                        </p>

                        <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
                            {blog.title}
                        </h2>

                        {blog.excerpt && (
                            <p className="max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
                                {blog.excerpt}
                            </p>
                        )}

                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {tags.map((tag, i) => (
                                    <Tag key={tag} index={i}>{tag}</Tag>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-muted">
                            {blog.author && <span>{blog.author}</span>}
                            {blog.author && <span aria-hidden="true">·</span>}
                            <time dateTime={blog.date}>{formatDate(blog.date, 'long')}</time>
                            <span aria-hidden="true">·</span>
                            <span>{estimateReadTime(blog)} min read</span>
                        </div>

                        <motion.span
                            className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-text-primary"
                            animate={reduce ? undefined : { x: hovered ? 3 : 0 }}
                            transition={SPRING_SWAP}
                        >
                            Read article
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h13M13 6l6 6-6 6" />
                            </svg>
                        </motion.span>
                    </div>
                </TiltSurface>
            </Link>
        </motion.div>
    );
};

/* ── Page ───────────────────────────────────────────────────────────────── */

const BlogList = () => {
    const blogs = React.useMemo(() => blogData.blogs || [], []);

    const filter = useCollectionFilter(blogs, {
        searchFields: (blog) => [blog.title, blog.excerpt, blog.author, ...(blog.tags || [])],
        facetField: (blog) => blog.tags || [],
        dateField: (blog) => blog.date,
        titleField: (blog) => blog.title,
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Unfiltered, the newest post is the hero and the grid holds the rest.
    // Filtered, the hero steps aside and the grid answers the query in full.
    const featured = filter.isFiltered ? null : blogs[0];
    const gridItems = featured
        ? filter.results.filter((blog) => blog.slug !== featured.slug)
        : filter.results;

    return (
        <>
            <SEO
                title="Blog - Alberto Crapanzano | Game Development Insights"
                description="Game development tutorials, insights, and project updates by Alberto Crapanzano (Albyeah) - Game Technical Designer & Creative Developer."
                keywords="Game Development Blog, Unity, Unreal Engine, C++, Technical Design, Alberto Crapanzano"
                url="/blog"
            />

            <RevealSection>
                <div className="space-y-8">
                    <Breadcrumb
                        items={[
                            { label: 'home', path: '/' },
                            { label: 'blog', path: '/blog' },
                        ]}
                    />

                    <PageHeader
                        title="blog"
                        subtitle="Insights, tutorials, and lessons learned from game development."
                    />

                    <AnimatePresence initial={false} mode="popLayout">
                        {featured && (
                            <motion.div
                                key="featured"
                                layout
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.4, ease: EASE_OUT }}
                            >
                                <FeaturedPost blog={featured} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {blogs.length > 1 && (
                        <FilterBar
                            filter={filter}
                            facetLabel="Topics"
                            facetPlaceholder="Filter by topic"
                            searchPlaceholder="Search posts, topics…"
                            noun="post"
                        />
                    )}

                    {/* With a single post the hero *is* the listing — an empty
                        grid underneath it would read as a missing section. */}
                    {(gridItems.length > 0 || filter.isFiltered || !featured) && (
                        <ResultsGrid
                            items={gridItems}
                            view={filter.view}
                            emptyTitle={blogs.length ? 'No posts match those filters' : 'No posts yet'}
                            emptyBody={
                                blogs.length
                                    ? 'Try a different topic, or clear the search.'
                                    : 'Writing is on the way — check back soon.'
                            }
                            onReset={filter.isFiltered ? filter.reset : undefined}
                            renderCard={(blog) => <BlogCard blog={blog} size="medium" />}
                            renderRow={(blog) => <BlogCard blog={blog} size="list" />}
                        />
                    )}
                </div>
            </RevealSection>
        </>
    );
};

export default BlogList;
