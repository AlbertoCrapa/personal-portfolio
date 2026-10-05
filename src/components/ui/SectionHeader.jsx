import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import styles from './SectionHeader.module.css';

/**
 * SectionHeader — a "/title" h2, an optional line under it, and an optional
 * link to the full collection on the right. The muted slash matches the page
 * titles. `size="display"` is the large Geist heading of a landing section;
 * the default is a compact Inter heading.
 */
const SectionHeader = ({ id, title, description, link, size = 'compact' }) => (
    <div className={styles.header}>
        <div className={styles.text}>
            <h2 id={id} className={size === 'display' ? styles.display : styles.compact}>
                <span className={styles.slash} aria-hidden="true">/</span>
                {title}
            </h2>
            {description && <p className={styles.description}>{description}</p>}
        </div>
        {link && (
            <Link to={link.to} className={styles.link}>
                {link.label}
                <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
            </Link>
        )}
    </div>
);

export default SectionHeader;
