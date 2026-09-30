import React from 'react';

import MediaCard from './motion/MediaCard';
import MediaRow from './motion/MediaRow';
import { estimateReadTime, formatDate } from '../../utils/utils';

/**
 * BlogCard — a post in card or row form.
 *
 * Shares MediaCard with ProjectCard so a mixed grid reads as one set. The
 * eyebrow carries date + read time (the two things that decide whether someone
 * opens a post), and the footer carries the tags.
 *
 * @param {Object} blog - Blog post data
 * @param {string} size - 'large' | 'medium' | 'small' | 'list'
 */
const BlogCard = ({ blog, size = 'medium' }) => {
    if (!blog) return null;

    const cover = blog.cover || blog.media?.[0]?.src;
    const tags = Array.isArray(blog.tags) ? blog.tags : [];
    const eyebrow = [formatDate(blog.date), `${estimateReadTime(blog)} min read`];

    if (size === 'list') {
        return (
            <MediaRow
                to={`/blog/${blog.slug}`}
                thumb={cover}
                title={blog.title}
                eyebrow={eyebrow}
                description={blog.excerpt}
            />
        );
    }

    return (
        <MediaCard
            to={`/blog/${blog.slug}`}
            cover={cover}
            title={blog.title}
            eyebrow={eyebrow}
            description={blog.excerpt}
            footer={tags.slice(0, 3)}
            footerMore={Math.max(0, tags.length - 3)}
            size={size}
        />
    );
};

export default React.memo(BlogCard);
