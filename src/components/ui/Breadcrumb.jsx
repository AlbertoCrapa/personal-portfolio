import React from 'react';

import { Breadcrumb as ArcBreadcrumb } from '../arc/breadcrumb/breadcrumb';
import styles from './Breadcrumb.module.css';

/**
 * Breadcrumb — Arc's breadcrumb with the site's `{ label, path }` items, shown
 * on phones only (where the top bar collapses into a menu); on larger screens
 * the top bar already says where you are. The last item is the current page.
 *
 * Arc's breadcrumb never truncates, so long labels (post titles) are cut to
 * their first words here. Arc renders `next/link`; src/next/link.jsx turns
 * that into a router link.
 */
const MAX_LABEL = 24;

export const shortLabel = (label) => {
    if (label.length <= MAX_LABEL) return label;
    let short = '';
    for (const word of label.split(/\s+/)) {
        if ((short ? `${short} ${word}` : word).length > MAX_LABEL - 1) break;
        short = short ? `${short} ${word}` : word;
    }
    return `${(short || label.slice(0, MAX_LABEL - 1)).replace(/[\s,:;.]+$/, '')}…`;
};

const Breadcrumb = ({ items = [] }) => (
    <div className={styles.mobileOnly}>
        <ArcBreadcrumb
            items={items.map((item, index) => {
                const label = shortLabel(item.label);
                return index === items.length - 1 ? { label } : { label, href: item.path };
            })}
        />
    </div>
);

export default Breadcrumb;
