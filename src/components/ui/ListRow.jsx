import React from 'react';
import { Link } from 'react-router-dom';

import styles from './ListRow.module.css';

/**
 * ListRow — the list-view form of CollectionCard: thumbnail, title, blurb and
 * byline in the same order as the card, so switching layouts never moves
 * where to look. Rows sit in one bordered group divided by hairlines.
 */
const ListRow = ({ to, thumb, title, description, meta = [], trailing }) => {
    const byline = meta.filter(Boolean).join(' · ');
    return (
        <Link to={to} className={styles.row}>
            {thumb && <img src={thumb} alt="" loading="lazy" decoding="async" className={styles.thumb} />}
            <span className={styles.text}>
                <span className={styles.title}>{title}</span>
                {description && <span className={styles.description}>{description}</span>}
                {byline && <span className={styles.meta}>{byline}</span>}
            </span>
            {trailing && <span className={styles.trailing}>{trailing}</span>}
        </Link>
    );
};

export default ListRow;
