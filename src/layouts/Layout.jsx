import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
// import PixelReveal from '../components/ui/PixelReveal';  // temporarily disabled
import data from '../data/data.json';

/**
 * Main Layout Component
 * Fixed top nav bar, scrollable content below
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
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 ">
                    {children}
                    <footer className="pt-8 mt-10 border-t border-border text-center space-y-3">
                        <Link
                            to="/privacy"
                            className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <p className="text-xs text-text-muted">
                            © {new Date().getFullYear()} {fullname}. All rights reserved.
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default Layout;
