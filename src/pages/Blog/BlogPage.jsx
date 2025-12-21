import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const blogs = blogData.blogs;
    const currentIndex = blogs.findIndex((b) => b.slug === slug);
    const blog = blogs[currentIndex];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    // 404 handling
    if (!blog) {
        return (
            <Layout>
                <SEO title="Blog Post Not Found - Alberto Crapanzano" noindex />
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
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
                description={blog.excerpt || blog.content?.[0]?.text?.substring(0, 160)}
                keywords={`${blog.title}, ${blog.tags?.join(', ') || ''}, Alberto Crapanzano, Game Development`}
                url={`/blog/${slug}`}
                image={blog.media?.[0]?.src ? `https://albyeah.com${blog.media[0].src}` : undefined}
                type="article"
            />

            <article className="space-y-8">
                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        { label: 'home', path: '/' },
                        { label: 'blog', path: '/blog' },
                        { label: slug, path: `/blog/${slug}` },
                    ]}
                />

                {/* Cover Image/Video */}
                {blog.media?.[0]?.src && (
                    <div className="rounded-xl overflow-hidden">
                        {isVideo(blog.media[0].src) ? (
                            <VideoPlayer
                                src={blog.media[0].src}
                                className="w-full aspect-video"
                            />
                        ) : (
                            <img
                                src={blog.media[0].src}
                                alt={blog.title}
                                className="w-full h-auto max-h-96 object-cover"
                                onError={(e) => { e.target.src = 'https://placehold.co/800x400'; }}
                            />
                        )}
                    </div>
                )}

                {/* Header */}
                <header className="space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight">
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
                {blog.content && blog.content.length > 0 && (
                    <div className="space-y-10">
                        {blog.content.map((section, idx) => {
                            // Skip first media as it's used as cover
                            const mediaItem = blog.media?.[idx + 1];

                            return (
                                <section key={idx} className="space-y-4">
                                    {/* Section Title */}
                                    {section.title && (
                                        <h2 className="text-xl md:text-2xl font-bold text-text-primary">
                                            {section.title}
                                        </h2>
                                    )}

                                    {/* Section Text */}
                                    {section.text && (
                                        <RichText text={section.text} />
                                    )}

                                    {/* Associated Media */}
                                    {mediaItem?.src && (
                                        <div className="mt-4 rounded-xl overflow-hidden max-w-3xl">
                                            {isVideo(mediaItem.src) ? (
                                                <VideoPlayer
                                                    src={mediaItem.src}
                                                    className="w-full"
                                                />
                                            ) : (
                                                <figure>
                                                    <img
                                                        src={mediaItem.src}
                                                        alt={mediaItem.description || `${blog.title} illustration`}
                                                        className="w-full h-auto"
                                                        onError={(e) => { e.target.src = 'https://placehold.co/800x600'; }}
                                                    />
                                                    {mediaItem.description && (
                                                        <figcaption className="text-sm text-text-muted mt-2 text-center">
                                                            {mediaItem.description}
                                                        </figcaption>
                                                    )}
                                                </figure>
                                            )}
                                        </div>
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
                            className="flex items-center gap-2 max-w-[45%]"
                        >
                            <span className="truncate">← {prevBlog.title}</span>
                        </Button>
                    ) : (
                        <div />
                    )}
                    {nextBlog ? (
                        <Button
                            to={`/blog/${nextBlog.slug}`}
                            variant="ghost"
                            className="flex items-center gap-2 max-w-[45%] text-right"
                        >
                            <span className="truncate">{nextBlog.title} →</span>
                        </Button>
                    ) : (
                        <div />
                    )}
                </nav>
            </article>
        </Layout>
    );
};

export default BlogPage;
