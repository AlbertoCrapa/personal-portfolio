import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import data from '../data/data.json';

/**
 * Main Layout Component
 * Fixed sidebar on left, scrollable content on right
 * Responsive: stacks on mobile
 */
const Layout = ({ children }) => {
    const fullname = data?.fullname || 'Alberto Crapanzano';

    return (
        <div className="min-h-svh bg-bg">
            <a href="#main-content" className="skip-link">Skip to main content</a>
            {/* Max-width container for entire layout, centered */}
            <div className="max-w-[1400px] mx-auto flex">
                {/* Fixed Sidebar */}
                <Sidebar />
                {/* <Smile /> */}
                {/* Main Content Area */}
                <main id="main-content" className="flex-1 lg:ml-sidebar min-h-svh overflow-x-hidden" tabIndex="-1">
                    <div className="px-4 pt-24 pb-6 lg:px-8 lg:py-10 w-full">
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
        </div>
    );
};

export default Layout;
