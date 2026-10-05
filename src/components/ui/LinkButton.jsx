import React from 'react';
import { Link } from 'react-router-dom';

import styles from './LinkButton.module.css';

/**
 * LinkButton — a link that looks like an Arc button.
 *
 * Arc's `button` renders a native <button>, and Arc's rule is that anything
 * that navigates is a link. This is that link, drawn with the same tokens as
 * the button (height, radius, primary/secondary fills, press scale), so a CTA
 * that goes somewhere matches the buttons that do something.
 *
 * `to` routes inside the app; `href` is for mail, files and other sites
 * (`external` opens it in a new tab).
 */
const LinkButton = ({ to, href, external = false, variant = 'secondary', size = 'md', children, ...props }) => {
    const className = `${styles.link} ${styles[variant]} ${styles[size]}`;
    if (to) {
        return <Link to={to} className={className} {...props}>{children}</Link>;
    }
    return (
        <a
            href={href}
            className={className}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            {...props}
        >
            {children}
        </a>
    );
};

export default LinkButton;
