import React, { useEffect } from 'react';

import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import PageHeader from '../../components/ui/PageHeader';
import BlogCard from '../../components/ui/BlogCard';
import FilterBar from '../../components/ui/FilterBar';
import ResultsGrid from '../../components/ui/ResultsGrid';
import { useCollectionFilter } from '../../hooks/useCollectionFilter';
import blogData from '../../data/blog.json';
import styles from '../pages.module.css';

/**
 * Blog — pick a post. Newest first; search and topic chips narrow the list,
 * and `?tag=` (from a topic on a post) arrives already applied. With a handful
 * of posts, sort and layout controls would be furniture, so there are none.
 */
const BlogList = () => {
    const blogs = React.useMemo(() => blogData.blogs || [], []);

    const filter = useCollectionFilter(blogs, {
        searchFields: (blog) => [blog.title, blog.excerpt, blog.author, ...(blog.tags || [])],
        facetField: (blog) => blog.tags || [],
        dateField: (blog) => blog.date,
        titleField: (blog) => blog.title,
    });

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

            <div className={styles.stack}>
                <Breadcrumb items={[{ label: 'home', path: '/' }, { label: 'blog', path: '/blog' }]} />

                <PageHeader
                    title="blog"
                    subtitle="Deep dives into gameplay systems, tools and the lessons behind them."
                />

                {blogs.length > 1 && (
                    <FilterBar
                        filter={filter}
                        searchLabel="Search posts"
                        searchPlaceholder="Title or topic"
                        facetLabel="Topics"
                        noun="post"
                        showSort={false}
                        showView={false}
                        facetPlaceholder="Add a topic"
                    />
                )}

                <ResultsGrid
                    items={filter.results}
                    empty={blogs.length
                        ? { title: 'No posts match these filters', description: 'Remove a topic or shorten the search to see more.' }
                        : { title: 'No posts yet', description: 'The first deep dive is on its way.' }}
                    onReset={filter.isFiltered ? filter.reset : undefined}
                    renderCard={(blog) => <BlogCard blog={blog} />}
                />
            </div>
        </>
    );
};

export default BlogList;
