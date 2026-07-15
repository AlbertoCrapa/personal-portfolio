import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import RevealSection from '../../components/ui/RevealSection';
import blogData from '../../data/blog.json';

/**
 * Blog List Page — modern editorial layout
 * Featured post hero + article grid
 */

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const estimateReadTime = (blog) => {
    const words = (blog.content || [])
        .filter((c) => c.type === 'section' && c.text)
        .reduce((acc, c) => acc + c.text.split(/\s+/).length, 0);
    return Math.max(1, Math.ceil(words / 200));
};

/* ── Featured hero card ─────────────────────────────── */
const FeaturedCard = ({ blog }) => {
    const cover = blog.cover || blog.media?.[0]?.src;
    const readTime = estimateReadTime(blog);

    return (
        <Link to={`/blog/${blog.slug}`} className="group block">
            <article className="relative rounded-2xl overflow-hidden bg-surface border border-border hover:border-[#4a4a4a] transition-colors">
                {cover && (
                    <div className="h-64 sm:h-80 lg:h-96 overflow-hidden">
                        <img
                            src={cover}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                            onError={(e) => { e.target.src = 'https://placehold.co/1200x500'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
                    </div>
                )}
                <div className={`${cover ? 'absolute bottom-0 left-0 right-0 p-6 sm:p-8' : 'p-6 sm:p-8'}`}>
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {blog.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="tag-capsule">{tag}</span>
                            ))}
                        </div>
                    )}
                    <h2 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight mb-3 transition-colors">
                        {blog.title}
                    </h2>
                    {blog.excerpt && (
                        <p className="text-text-secondary text-sm sm:text-base line-clamp-2 mb-4 max-w-2xl">
                            {blog.excerpt}
                        </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                        {blog.author && <span>{blog.author}</span>}
                        <span>·</span>
                        <time dateTime={blog.date}>{formatDate(blog.date)}</time>
                        <span>·</span>
                        <span>{readTime} min read</span>
                    </div>
                </div>
            </article>
        </Link>
    );
};

/* ── Article card (grid) ────────────────────────────── */
const ArticleCard = ({ blog }) => {
    const cover = blog.cover || blog.media?.[0]?.src;
    const readTime = estimateReadTime(blog);

    return (
        <Link to={`/blog/${blog.slug}`} className="group block h-full">
            <article className="flex flex-col h-full rounded-xl overflow-hidden bg-surface border border-border hover:border-[#4a4a4a] transition-colors">
                {cover && (
                    <div className="h-44 overflow-hidden flex-shrink-0">
                        <img
                            src={cover}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            onError={(e) => { e.target.src = 'https://placehold.co/600x300'; }}
                        />
                    </div>
                )}
                <div className="flex flex-col flex-1 p-4 space-y-2">
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {blog.tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="tag-capsule">{tag}</span>
                            ))}
                        </div>
                    )}
                    <h3 className="text-base font-bold text-text-primary leading-snug transition-colors line-clamp-2">
                        {blog.title}
                    </h3>
                    {blog.excerpt && (
                        <p className="text-sm text-text-secondary line-clamp-2 flex-1">
                            {blog.excerpt}
                        </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-text-muted pt-1">
                        <time dateTime={blog.date}>{formatDate(blog.date)}</time>
                        <span>·</span>
                        <span>{readTime} min read</span>
                    </div>
                </div>
            </article>
        </Link>
    );
};

/* ── Page ───────────────────────────────────────────── */
const BlogList = () => {
    const blogs = blogData.blogs;
    const [featured, ...rest] = blogs;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <SEO
                title="Blog - Alberto Crapanzano | Game Development Insights"
                description="Game development tutorials, insights, and project updates by Alberto Crapanzano (Albyeah) - Game Technical Designer & Creative Developer."
                keywords="Game Development Blog, Unity, Unreal Engine, C++, Technical Design, Alberto Crapanzano"
                url="/blog"
            />

            <RevealSection>
                <div className="space-y-10">
                    <Breadcrumb
                        items={[
                            { label: 'home', path: '/' },
                            { label: 'blog', path: '/blog' },
                        ]}
                    />

                    <header>
                        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2 lowercase">
                            <span className="text-text-muted mr-2">/</span>
                            blog
                        </h1>
                        <p className="text-text-secondary">
                            Insights, tutorials, and lessons learned from game development.
                        </p>
                    </header>

                    {/* Featured article */}
                    {featured && <FeaturedCard blog={featured} />}

                    {/* Article grid */}
                    {rest.length > 0 && (
                        <section>
                            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-5">
                                More articles
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {rest.map((blog) => (
                                    <ArticleCard key={blog.slug} blog={blog} />
                                ))}
                            </div>
                        </section>
                    )}

                    {blogs.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-text-muted">No blog posts yet. Check back soon!</p>
                        </div>
                    )}
                </div>
            </RevealSection>
        </>
    );
};

export default BlogList;
