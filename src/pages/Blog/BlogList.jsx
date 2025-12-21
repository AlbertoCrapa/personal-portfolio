import React, { useEffect } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import Layout from '../../layouts/Layout';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import BlogCard from '../../components/ui/BlogCard';
import blogData from '../../data/blog.json';

/**
 * Blog List Page
 * Displays all blog posts
 * Grid on desktop, list on mobile
 */
const BlogList = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const blogs = blogData.blogs;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            <SEO
                title="Blog - Alberto Crapanzano | Game Development Insights"
                description="Game development tutorials, insights, and project updates by Alberto Crapanzano (Albyeah) - Game Technical Designer & Creative Developer."
                keywords="Game Development Blog, Unity, Unreal Engine, C++, Technical Design, Alberto Crapanzano"
                url="/blog"
            />

            <div className="space-y-6">
                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        { label: 'home', path: '/' },
                        { label: 'blog', path: '/blog' },
                    ]}
                />

                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">Blog</h1>
                    <p className="text-text-secondary">
                        Insights, tutorials, and lessons learned from game development.
                    </p>
                </header>

                {/* Blog Posts */}
                {isMobile ? (
                    // Mobile: List View
                    <div className="space-y-4">
                        {blogs.map((blog) => (
                            <BlogCard key={blog.slug} blog={blog} size="list" />
                        ))}
                    </div>
                ) : (
                    // Desktop: Grid View
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {blogs.map((blog) => (
                            <BlogCard key={blog.slug} blog={blog} size="medium" />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {blogs.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-text-muted">No blog posts yet. Check back soon!</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default BlogList;
