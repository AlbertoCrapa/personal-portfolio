import React from 'react';

import styles from './PageHeader.module.css';

/**
 * PageHeader — the "/title" of a listing page and its one line of context.
 *
 * The muted slash and the lowercase title are the site's own voice: the same
 * words as the top bar's lowercase links (projects, playground, blog), so the
 * page you land on answers the label you pressed. On phones the breadcrumb
 * takes the title's place, as it always has; the h1 stays for screen readers.
 */
const PageHeader = ({ title, subtitle, children }) => (
    <header className={styles.header}>
        <h1 className={styles.title}>
            <span className={styles.slash} aria-hidden="true">/</span>
            {title}
        </h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {children}
    </header>
);

export default PageHeader;
