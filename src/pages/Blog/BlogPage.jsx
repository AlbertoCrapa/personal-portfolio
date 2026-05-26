import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import VideoPlayer from '../../components/ui/VideoPlayer';
import ModelViewer from '../../components/ui/ModelViewer';
import RichText from '../../components/ui/RichText';
import RevealSection from '../../components/ui/RevealSection';
import TableOfContents, { toId } from '../../components/ui/TableOfContents';
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

    const blogElements = Array.isArray(blog?.content) ? blog.content : [];
    const tocSections = blogElements
        .filter((el) => el?.title && (el?.type === 'section' || !el?.type))
        .map((el) => ({ id: toId(el.title), title: el.title }));
    const firstMediaIndex = blogElements.findIndex((item) => {
        const itemType = item?.type || (item?.src ? 'media' : 'section');
        return itemType === 'media' && item?.src;
    });

    // Check if media is video
    const isVideo = (src) => {
        if (!src) return false;
        return /\.(mp4|webm|mov)$/i.test(src);
    };

    const coverSrc = blog?.cover || (firstMediaIndex >= 0 ? blogElements[firstMediaIndex]?.src : null);
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
        description: blog.excerpt || blogElements?.[0]?.text?.substring(0, 160),
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

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).replace(/\//g, '-');
    };

    return (
        <>
            <SEO
                title={`${blog.title} - Alberto Crapanzano Blog`}
                description={blog.excerpt || blogElements?.[0]?.text?.substring(0, 160)}
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
                    <header className="space-y-4  pt-2">
                        <h1 className="text-2xl md:text-4xl font-bold text-text-primary leading-tight">
                            {blog.title}
                        </h1>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
                            <span>Last update: {formatDate(blog.date)}</span>
                            <span className="text-text-muted">|</span>
                            <a href="/feed.json" className="text-accent-blue hover:underline">
                                RSS feed
                            </a>
                        </div>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {blog.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="tag-capsule"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>

                    {/* Content + ToC */}
                    <div className="flex gap-16 pt-8">
                        <div className="flex-1 min-w-0 max-w-3xl space-y-8 md:space-y-10">
                            {blogElements.map((element, idx) => {
                                const elementType = element?.type || (element?.src ? 'media' : 'section');

                                // Avoid rendering the same first media twice when it's used as cover.
                                if (elementType === 'media' && idx === firstMediaIndex && element?.src === coverSrc) {
                                    return null;
                                }

                                if (elementType === 'model' && element?.src) {
                                    return (
                                        <section key={idx} className="space-y-2 md:space-y-4 max-w-3xl">
                                            <div>
                                                <ModelViewer
                                                    src={element.src}
                                                    poster={element.poster}
                                                    alt={element.alt || element.description || `${blog.title} 3D model`}
                                                    description={element.description}
                                                    className="w-full h-[280px] sm:h-[340px] md:h-[420px]"
                                                />
                                            </div>
                                        </section>
                                    );
                                }

                                if (elementType === 'media' && element?.src) {
                                    return (
                                        <section key={idx} className="space-y-2 md:space-y-4 max-w-3xl">
                                            <div>
                                                {isVideo(element.src) ? (
                                                    <figure className="space-y-1">
                                                        <div className="rounded-xl overflow-hidden">
                                                            <VideoPlayer
                                                                src={element.src}
                                                                className="w-full"
                                                            />
                                                        </div>
                                                        {element.description && (
                                                            <figcaption className="text-sm text-text-muted text-center">
                                                                {element.description}
                                                            </figcaption>
                                                        )}
                                                    </figure>
                                                ) : (
                                                    <figure className="space-y-1">
                                                        <div className="rounded-xl overflow-hidden">
                                                            <img
                                                                src={element.src}
                                                                alt={element.description || `${blog.title} media`}
                                                                className="w-full h-auto"
                                                                onError={(e) => { e.target.src = 'https://placehold.co/800x600'; }}
                                                            />
                                                        </div>
                                                        {element.description && (
                                                            <figcaption className="text-sm text-text-muted text-center">
                                                                {element.description}
                                                            </figcaption>
                                                        )}
                                                    </figure>
                                                )}
                                            </div>
                                        </section>
                                    );
                                }

                                return (
                                    <section key={idx} className="space-y-2 md:space-y-4 max-w-3xl">
                                        {/* Section Title */}
                                        {element?.title && (
                                            <h2 id={toId(element.title)} className="text-2xl font-bold text-text-primary">
                                                {element.title}
                                            </h2>
                                        )}

                                        {/* Section Text */}
                                        {element?.text && (
                                            <RichText text={element.text} />
                                        )}
                                    </section>
                                );
                            })}

                            {/* Navigation */}
                            <nav className="!mt-10 pt-8 border-t border-border">
                                <div className="flex justify-between items-start gap-8">
                                    {prevBlog ? (
                                        <Link
                                            to={`/blog/${prevBlog.slug}`}
                                            className="group flex flex-col gap-1 flex-1 max-w-[46%]"
                                        >
                                            <span className="text-xs uppercase tracking-wider text-text-muted group-hover:text-text-primary transition-colors">
                                                ← Previous
                                            </span>
                                            <span className="text-sm font-semibold text-text-primary group-hover:text-accent-blue transition-colors line-clamp-2 leading-snug">
                                                {prevBlog.title}
                                            </span>
                                        </Link>
                                    ) : <div className="flex-1" />}
                                    {nextBlog ? (
                                        <Link
                                            to={`/blog/${nextBlog.slug}`}
                                            className="group flex flex-col gap-1 flex-1 max-w-[46%] items-end text-right"
                                        >
                                            <span className="text-xs uppercase tracking-wider text-text-muted group-hover:text-text-primary transition-colors">
                                                Next →
                                            </span>
                                            <span className="text-sm font-semibold text-text-primary group-hover:text-accent-blue transition-colors line-clamp-2 leading-snug">
                                                {nextBlog.title}
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
