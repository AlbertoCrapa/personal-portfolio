import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Rss } from 'lucide-react';

import SEO from '../../components/SEO';
import ArticleLayout from '../../components/ui/ArticleLayout';
import MetaStrip from '../../components/ui/MetaStrip';
import NotFoundState from '../../components/ui/NotFoundState';
import {
    getArticleSummary,
    getFirstMediaSrc,
    getTocSections,
    normalizeContent,
} from '../../components/ui/article/normalize';
import { toId } from '../../components/ui/TableOfContents';
import { estimateReadTime, formatDate } from '../../utils/utils';
import blogData from '../../data/blog.json';
import styles from './BlogPage.module.css';

/**
 * BlogPage — one post. Same layout as a project page, so the two article
 * types read identically below the title. Topics link to /blog?tag=.
 */
const isVideo = (src) => (src ? /\.(mp4|webm|mov)$/i.test(src) : false);

const BlogPage = () => {
    const { slug } = useParams();
    const blogs = blogData.blogs;
    const currentIndex = blogs.findIndex((b) => b.slug === slug);
    const blog = blogs[currentIndex];

    const contentBlocks = normalizeContent(blog?.content);
    const tocSections = getTocSections(contentBlocks, toId);
    const summary = getArticleSummary(contentBlocks, 160);

    const coverSrc = blog?.cover || getFirstMediaSrc(contentBlocks);
    const coverPoster = blog?.cover && !isVideo(blog?.cover) ? blog.cover : undefined;
    const blogSchema = blog ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: blog.title,
        image: coverSrc ? `https://albyeah.com${coverSrc}` : 'https://albyeah.com/img/og-image.jpg',
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

    if (!blog) {
        return (
            <>
                <SEO title="Blog Post Not Found - Alberto Crapanzano" noindex />
                <NotFoundState
                    title="Post not found"
                    description="This post was moved or never existed. Every post is listed on the blog."
                    to="/blog"
                    label="Browse posts"
                />
            </>
        );
    }

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

            <ArticleLayout
                breadcrumb={[
                    { label: 'home', path: '/' },
                    { label: 'blog', path: '/blog' },
                    { label: blog.title, path: `/blog/${slug}` },
                ]}
                cover={coverSrc}
                poster={coverPoster}
                title={blog.title}
                subtitle={blog.excerpt}
                meta={(
                    <MetaStrip
                        facts={[
                            { label: 'Published', value: formatDate(blog.date, 'long') },
                            { label: 'Reading time', value: `${estimateReadTime(blog)} min` },
                            { label: 'Author', value: blog.author },
                        ]}
                        tags={blog.tags || []}
                        tagsLabel="Topics"
                        tagTo={(tag) => `/blog?tag=${encodeURIComponent(tag)}`}
                        aside={(
                            <a href="/feed.json" className={styles.feed}>
                                <Rss size={14} strokeWidth={1.75} aria-hidden="true" />
                                Follow the feed
                            </a>
                        )}
                    />
                )}
                blocks={contentBlocks}
                skipMediaSrc={coverSrc}
                tocSections={tocSections}
                previous={prevBlog && { to: `/blog/${prevBlog.slug}`, title: prevBlog.title }}
                next={nextBlog && { to: `/blog/${nextBlog.slug}`, title: nextBlog.title }}
            />
        </>
    );
};

export default BlogPage;
