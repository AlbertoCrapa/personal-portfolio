import React from 'react';
import { Link } from 'react-router-dom';

/**
 * BlogCard Component
 * Card for displaying blog posts
 * 
 * @param {Object} blog - Blog post data
 * @param {string} size - 'large' | 'medium' | 'list'
 */
const BlogCard = ({ blog, size = 'medium' }) => {
    if (!blog) return null;

    const coverSrc = blog.cover || blog.media?.[0]?.src;

    const sizeClasses = {
        large: 'col-span-2 row-span-2',
        medium: 'col-span-1 row-span-1',
    };

    const imageHeights = {
        large: 'h-64 md:h-72',
        medium: 'h-44 md:h-52',
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // List view
    if (size === 'list') {
        return (
            <Link
                to={`/blog/${blog.slug}`}
                className="flex items-center gap-4 group py-3 hover:bg-surface/50 rounded-lg transition-colors -mx-2 px-2"
            >
                {coverSrc && (
                    <div className="flex-shrink-0 w-32 md:w-40 rounded-lg overflow-hidden">
                        <img
                            src={coverSrc}
                            alt={blog.title}
                            className="w-full h-20 md:h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.target.src = 'https://placehold.co/400x300'; }}
                        />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-text-primary group-hover:text-accent-blue transition-colors">
                        {blog.title}
                    </h3>
                    <p className="text-sm text-text-muted mt-1">
                        {formatDate(blog.date)}
                    </p>
                </div>
            </Link>
        );
    }

    return (
        <Link
            to={`/blog/${blog.slug}`}
            className={`block group ${sizeClasses[size] || sizeClasses.medium}`}
        >
            <article className="relative rounded-xl overflow-hidden bg-surface border border-border hover:border-[#4a4a4a] transition-colors h-full">
                {/* Cover Image */}
                {coverSrc && (
                    <div className={`${imageHeights[size] || imageHeights.medium} overflow-hidden relative`}>
                        <img
                            src={coverSrc}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            onError={(e) => { e.target.src = 'https://placehold.co/400x300'; }}
                        />
                    </div>
                )}

                {/* Content */}
                <div className="p-4 space-y-3">
                    <h3 className={`font-bold text-text-primary leading-tight ${size === 'large' ? 'text-xl md:text-2xl' : 'text-base md:text-lg'} group-hover:text-accent-blue transition-colors`}>
                        {blog.title}
                    </h3>

                    <p className="text-xs uppercase tracking-wide text-text-muted">
                        Last update: {formatDate(blog.date)}
                    </p>

                    {blog.excerpt && (
                        <p className="text-sm text-text-secondary line-clamp-2">
                            {blog.excerpt}
                        </p>
                    )}

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                            {blog.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="tag-capsule"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </article>
        </Link>
    );
};

export default BlogCard;
