import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../layouts/Layout';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import VideoPlayer from '../../components/ui/VideoPlayer';
import RichText from '../../components/ui/RichText';
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
    const firstMediaIndex = blogElements.findIndex((item) => {
        const itemType = item?.type || (item?.src ? 'media' : 'section');
        return itemType === 'media' && item?.src;
    });
    const coverSrc = blog?.cover || (firstMediaIndex >= 0 ? blogElements[firstMediaIndex]?.src : null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    // 404 handling
    if (!blog) {
        return (
            <Layout>
                <SEO title="Blog Post Not Found - Alberto Crapanzano" noindex />
                <div className="min-h-[60svh] flex flex-col items-center justify-center text-center">
                    <h1 className="text-5xl font-bold text-text-primary mb-4">Oops!</h1>
                    <p className="text-text-secondary mb-6">The blog post you're looking for doesn't exist.</p>
                    <div className="flex gap-4">
                        <Button to="/blog" variant="primary">← Back to Blog</Button>
                    </div>
                </div>
            </Layout>
        );
    }

    // Navigation
    const prevBlog = currentIndex > 0 ? blogs[currentIndex - 1] : null;
    const nextBlog = currentIndex < blogs.length - 1 ? blogs[currentIndex + 1] : null;

    // Check if media is video
    const isVideo = (src) => {
        if (!src) return false;
        return /\.(mp4|webm|mov)$/i.test(src);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).replace(/\//g, '-');
    };

    return (
        <Layout>
            <SEO
                title={`${blog.title} - Alberto Crapanzano Blog`}
                description={blog.excerpt || blogElements?.[0]?.text?.substring(0, 160)}
                keywords={`${blog.title}, ${blog.tags?.join(', ') || ''}, Alberto Crapanzano, Game Development`}
                url={`/blog/${slug}`}
                image={coverSrc ? `https://albyeah.com${coverSrc}` : undefined}
                type="article"
            />

            <div className="space-y-2">
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
                    <div className="rounded-xl overflow-hidden">
                        {isVideo(coverSrc) ? (
                            <VideoPlayer
                                src={coverSrc}
                                className="w-full aspect-video"
                            />
                        ) : (
                            <img
                                src={coverSrc}
                                alt={blog.title}
                                className="w-full h-auto"
                                onError={(e) => { e.target.src = 'https://placehold.co/800x400'; }}
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
                                    className="text-xs px-2 py-1 bg-surface rounded-md text-text-secondary"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                {/* Content Sections */}
                {blogElements.length > 0 && (
                    <div className="space-y-8 md:space-y-10 pt-8">
                        {blogElements.map((element, idx) => {
                            const elementType = element?.type || (element?.src ? 'media' : 'section');

                            // Avoid rendering the same first media twice when it's used as cover.
                            if (elementType === 'media' && idx === firstMediaIndex && element?.src === coverSrc) {
                                return null;
                            }

                            if (elementType === 'media' && element?.src) {
                                return (
                                    <section key={idx} className="space-y-3 md:space-y-4 max-w-3xl">
                                        <div className="rounded-xl overflow-hidden max-w-3xl">
                                            {isVideo(element.src) ? (
                                                <VideoPlayer
                                                    src={element.src}
                                                    className="w-full"
                                                />
                                            ) : (
                                                <figure className="space-y-2">
                                                    <img
                                                        src={element.src}
                                                        alt={element.description || `${blog.title} illustration`}
                                                        className="w-full h-auto"
                                                        onError={(e) => { e.target.src = 'https://placehold.co/800x600'; }}
                                                    />
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
                                <section key={idx} className="space-y-3 md:space-y-4 max-w-3xl">
                                    {/* Section Title */}
                                    {element?.title && (
                                        <h2 className="text-xl md:text-2xl font-bold text-text-primary">
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
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex justify-between items-center pt-8 border-t border-border">
                    {prevBlog ? (
                        <Button
                            to={`/blog/${prevBlog.slug}`}
                            variant="ghost"
                            className="flex items-center gap-2"
                        >
                            ← {prevBlog.title}
                        </Button>
                    ) : (
                        <div />
                    )}
                    {nextBlog ? (
                        <Button
                            to={`/blog/${nextBlog.slug}`}
                            variant="ghost"
                            className="flex items-center gap-2"
                        >
                            {nextBlog.title} →
                        </Button>
                    ) : (
                        <div />
                    )}
                </nav>
            </div>
        </Layout>
    );
};

export default BlogPage;
