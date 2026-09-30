import React from 'react';
import { Link } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ui/ThemeToggle';
// import PixelReveal from '../components/ui/PixelReveal';  // temporarily disabled
import data from '../data/data.json';

/**
 * Main Layout Component
 * Fixed top nav bar, scrollable content below.
 *
 * The theme switch lives here rather than in the top bar: it's a one-time
 * setting, not navigation, and the wipe reads better starting from the bottom
 * of the page than from a fixed bar that never moves.
 */
const Layout = ({ children }) => {
    const fullname = data?.fullname || 'Alberto Crapanzano';

    return (
        <div className="min-h-svh">
            {/* Full-viewport pixel background — ambient only, no explosion */}
            {/* <PixelReveal explode={false} />  temporarily disabled */}
            <a href="#main-content" className="skip-link">Skip to main content</a>
            {/* Top navigation bar */}
            <Sidebar />
            {/* Main Content Area — offset by nav height (h-14 = 56px) */}
            <main id="main-content" className="pt-14 min-h-svh overflow-x-clip" style={{ position: 'relative', zIndex: 1 }} tabIndex="-1">
                {/* .page-shell is shared with the top bar, so the logo and the
                    page content always share one left edge. See theme.css. */}
                <div className="page-shell py-8 lg:py-10">
                    {children}

                    <footer className="mt-16 border-t border-border pt-8">
                        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="order-3 text-xs text-text-muted sm:order-1">
                                © {new Date().getFullYear()} {fullname}. All rights reserved.
                            </p>

                            <Link
                                to="/privacy"
                                className="order-2 text-sm text-text-muted underline-offset-4 transition-colors hover:text-text-primary hover:underline"
                            >
                                Privacy Policy
                            </Link>

                            <div className="order-1 sm:order-3">
                                <ThemeToggle origin="bottom" />
                            </div>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default Layout;
