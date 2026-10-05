import React from 'react';

import CollectionCard from './CollectionCard';
import ListRow from './ListRow';
import { estimateReadTime, formatDate } from '../../utils/utils';

/**
 * BlogCard — a post as a card or a list row. Same card as projects, so a mixed
 * set reads as one; the byline carries date and read time.
 *
 * @param {Object} blog
 * @param {string} size - 'medium' | 'list'
 */
const BlogCard = ({ blog, size = 'medium' }) => {
    if (!blog) return null;

    const cover = blog.cover || blog.media?.[0]?.src;
    const meta = [formatDate(blog.date), `${estimateReadTime(blog)} min read`];

    if (size === 'list') {
        return <ListRow to={`/blog/${blog.slug}`} thumb={cover} title={blog.title} description={blog.excerpt} meta={meta} />;
    }

    return (
        <CollectionCard
            to={`/blog/${blog.slug}`}
            cover={cover}
            title={blog.title}
            description={blog.excerpt}
            tags={blog.tags || []}
            tagTo={(tag) => `/blog?tag=${encodeURIComponent(tag)}`}
            meta={meta}
        />
    );
};

export default React.memo(BlogCard);
