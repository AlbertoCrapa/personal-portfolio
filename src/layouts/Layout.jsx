import React from 'react';
import { Link } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import ThemeControl from '../components/ui/ThemeControl';
import CuttingMat from '../components/ui/CuttingMat';
import data from '../data/data.json';
import styles from './Layout.module.css';

/**
 * Layout — the fixed top bar, the one page container, and the footer.
 *
 * `.page-shell` (theme.css) is the only container on the site: it owns the
 * max width and the gutters, and the top bar uses it too so the logo and the
 * page content share one left edge. Pages fill it and never add their own.
 *
 * The top bar predates Arc and must render exactly as it always has, so it
 * sits in a `.legacy-zone`, which restores its type, ink and focus rings.
 */
const Layout = ({ children }) => {
    const fullname = data?.fullname || 'Alberto Crapanzano';

    return (
        <div className={styles.app}>
            <a href="#main-content" className="skip-link">Skip to content</a>
            <CuttingMat />
            <div className="legacy-zone legacy-zone--contents">
                <Sidebar />
            </div>
            <main id="main-content" className={styles.main} tabIndex="-1">
                <div className={`page-shell ${styles.page}`}>
                    {children}

                    <footer className={styles.footer}>
                        <p className={styles.copyright}>
                            © {new Date().getFullYear()} {fullname}
                        </p>
                        <Link to="/privacy" className={styles.footerLink}>Privacy policy</Link>
                        <ThemeControl />
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default Layout;
