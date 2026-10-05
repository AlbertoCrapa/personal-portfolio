import React from 'react';
import { Link } from 'react-router-dom';

import { Badge } from '../arc/badge/badge';
import styles from './Tag.module.css';

/**
 * Tag — one technology or topic.
 *
 * The face is an Arc badge, set on the page background with a strong border
 * (the darker chip the site has always used, because it reads better on a
 * card). A tag that filters a listing stays a real router link: `to` is the
 * `?tag=` URL the listing reads.
 */
const Tag = ({ children, to, size = 'sm' }) => {
    const badge = <Badge size={size}>{children}</Badge>;
    if (!to) return <span className={styles.tag}>{badge}</span>;
    return (
        <Link to={to} className={`${styles.tag} ${styles.link}`}>
            {badge}
        </Link>
    );
};

export default Tag;
