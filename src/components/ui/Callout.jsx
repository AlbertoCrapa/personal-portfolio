import React from 'react';
import { Info, TriangleAlert } from 'lucide-react';

import styles from './article/article.module.css';

/**
 * Callout — an info or warning note inside an article. A bordered surface with
 * the tone carried by the icon (and its label for screen readers), not by a
 * tinted panel.
 *
 * @param {string} type - 'info' | 'warning'
 */
const TONES = {
    info: { Icon: Info, className: styles.calloutInfo, label: 'Note' },
    warning: { Icon: TriangleAlert, className: styles.calloutWarning, label: 'Warning' },
};

const Callout = ({ type = 'info', children }) => {
    const { Icon, className, label } = TONES[type] || TONES.info;
    return (
        <div className={`${styles.callout} ${className}`}>
            <Icon size={18} strokeWidth={1.75} aria-label={label} role="img" />
            <div className={styles.calloutBody}>{children}</div>
        </div>
    );
};

export default Callout;
