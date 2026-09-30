import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import VideoPlayer from '../../components/ui/VideoPlayer';
import ArticleBody from '../../components/ui/ArticleBody';
import MetaStrip from '../../components/ui/MetaStrip';
import {
    getArticleSummary,
    getFirstMediaSrc,
    getTocSections,
    normalizeContent,
} from '../../components/ui/article/normalize';
import RevealSection from '../../components/ui/RevealSection';
import TableOfContents, { toId } from '../../components/ui/TableOfContents';
import { ShimmerText } from '../../components/ui/NavAnimations';
import { estimateReadTime, formatDate } from '../../utils/utils';
import blogData from '../../data/blog.json';

/**
 * Blog Post Detail Page
 * Displays full blog post with content, media, and navigation
 */
const BlogPage = () => {
    const { slug } = useParams();
    const blogs = blogData.blogs;
    const currentIndex = blogs.findIndex((b) => b.slug === slug);
    const blog = blogs[currentIndex];

    const contentBlocks = normalizeContent(blog?.content);
    const tocSections = getTocSections(contentBlocks, toId);
    const summary = getArticleSummary(contentBlocks, 160);

    // Check if media is video
    const isVideo = (src) => {
        if (!src) return false;
        return /\.(mp4|webm|mov)$/i.test(src);
    };

    const coverSrc = blog?.cover || getFirstMediaSrc(contentBlocks);
    const coverPoster = blog?.cover && !isVideo(blog?.cover) ? blog.cover : undefined;
    const blogSchema = blog ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: blog.title,
        image: coverSrc ? `https://albyeah.com${coverSrc}` : 'https://albyeah.com/img/profile.jpg',
        datePublished: blog.date,
        dateModified: blog.date,
        author: {
            '@type': 'Person',
            name: 'Alberto Crapanzano',
            url: 'https://albyeah.com/about',
        },
        publisher: {
            '@type': 'Person',
            name: 'Alberto Crapanzano',
            url: 'https://albyeah.com',
        },
        description: blog.excerpt || summary,
        mainEntityOfPage: `https://albyeah.com/blog/${slug}`,
    } : null;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    // 404 handling
    if (!blog) {
        return (
            <>
                <SEO title="Blog Post Not Found - Alberto Crapanzano" noindex />
                <div className="min-h-[60svh] flex flex-col items-center justify-center text-center">
                    <h1 className="text-5xl font-bold text-text-primary mb-4">Oops!</h1>
                    <p className="text-text-secondary mb-6">The blog post you're looking for doesn't exist.</p>
                    <div className="flex gap-4">
                        <Button to="/blog" variant="primary">← Back to Blog</Button>
                    </div>
                </div>
            </>
        );
    }

    // Navigation
    const prevBlog = currentIndex > 0 ? blogs[currentIndex - 1] : null;
    const nextBlog = currentIndex < blogs.length - 1 ? blogs[currentIndex + 1] : null;

    return (
        <>
            <SEO
                title={`${blog.title} - Alberto Crapanzano Blog`}
                description={blog.excerpt || summary}
                keywords={`${blog.title}, ${blog.tags?.join(', ') || ''}, Alberto Crapanzano, Game Development`}
                url={`/blog/${slug}`}
                image={coverSrc ? `https://albyeah.com${coverSrc}` : undefined}
                type="article"
                structuredData={blogSchema}
            />

            <RevealSection>
                <div className="space-y-1">
                    {/* Breadcrumb */}
                    <Breadcrumb
                        items={[
                            { label: 'home', path: '/' },
                            { label: 'blog', path: '/blog' },
                            { label: slug, path: `/blog/${slug}` },
                        ]}
                    />

                    {/* Cover Image/Video */}
                    {coverSrc && (
                        <div className="rounded-xl overflow-hidden h-44 sm:h-52 md:h-56 lg:h-64 max-h-[280px]">
                            {isVideo(coverSrc) ? (
                                <VideoPlayer
                                    src={coverSrc}
                                    poster={coverPoster}
                                    className="w-full h-full"
                                    pauseOffscreen={false}
                                />
                            ) : (
                                <img
                                    src={coverSrc}
                                    alt={blog.title}
                                    className="w-full h-full object-cover object-center"
                                    onError={(e) => { e.target.src = 'https://placehold.co/800x600'; }}
                                />
                            )}
                        </div>
                    )}

                    {/* Header */}
                    <header className="space-y-5 pt-4">
                        <div className="space-y-2.5">
                            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
                                Article
                            </p>

                            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-4xl">
                                {blog.title}
                            </h1>

                            {blog.excerpt && (
                                <p className="max-w-2xl text-lg leading-relaxed text-text-secondary">
                                    {blog.excerpt}
                                </p>
                            )}
                        </div>

                        {/* Same labelled spec sheet the project pages use, so the
                            two article types read identically below the title. */}
                        <MetaStrip
                            facts={[
                                { label: 'Published', value: formatDate(blog.date, 'long') },
                                { label: 'Reading time', value: `${estimateReadTime(blog)} min` },
                                { label: 'Author', value: blog.author },
                            ]}
                            tags={blog.tags || []}
                            tagsLabel="Topics"
                            tagTo={(tag) => `/blog?tag=${encodeURIComponent(tag)}`}
                            aside={
                                <a
                                    href="/feed.json"
                                    className="ml-auto flex-shrink-0 text-xs font-semibold text-text-muted underline-offset-4 hover:text-text-primary hover:underline"
                                >
                                    RSS feed
                                </a>
                            }
                        />
                    </header>

                    {/* Content + ToC */}
                    <div className="flex gap-10 pt-8 xl:gap-24">
                        <div className="flex-1 min-w-0 max-w-3xl space-y-10">
                            <ArticleBody
                                blocks={contentBlocks}
                                title={blog.title}
                                skipMediaSrc={coverSrc}
                            />

                            {/* Navigation */}
                            <nav className="!mt-10 pt-8 border-t border-border">
                                <div className="flex justify-between items-start gap-8">
                                    {prevBlog ? (
                                        <Link
                                            to={`/blog/${prevBlog.slug}`}
                                            className="group flex flex-col gap-1 flex-1 max-w-[46%]"
                                        >
                                            <span className="text-xs uppercase tracking-wider text-text-muted group-hover:text-text-secondary transition-colors">
                                                ← Previous
                                            </span>
                                            <span className="text-sm font-semibold line-clamp-2 leading-snug">
                                                <ShimmerText text={prevBlog.title} inactiveColor="var(--color-text-primary)" hoverColor="var(--color-text-secondary)" />
                                            </span>
                                        </Link>
                                    ) : <div className="flex-1" />}
                                    {nextBlog ? (
                                        <Link
                                            to={`/blog/${nextBlog.slug}`}
                                            className="group flex flex-col gap-1 flex-1 max-w-[46%] items-end text-right"
                                        >
                                            <span className="text-xs uppercase tracking-wider text-text-muted group-hover:text-text-secondary transition-colors">
                                                Next →
                                            </span>
                                            <span className="text-sm font-semibold line-clamp-2 leading-snug">
                                                <ShimmerText text={nextBlog.title} inactiveColor="var(--color-text-primary)" hoverColor="var(--color-text-secondary)" />
                                            </span>
                                        </Link>
                                    ) : <div className="flex-1" />}
                                </div>
                            </nav>
                        </div>
                        <TableOfContents sections={tocSections} />
                    </div>
                </div>
            </RevealSection>
        </>
    );
};

export default BlogPage;
