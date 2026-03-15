import React from 'react';
import Sidebar from '../components/Sidebar';

/**
 * Main Layout Component
 * Fixed sidebar on left, scrollable content on right
 * Responsive: stacks on mobile
 */
const Layout = ({ children }) => {
    return (
        <div className="min-h-svh bg-bg">
            {/* Max-width container for entire layout, centered */}
            <div className="max-w-[1400px] mx-auto flex">
                {/* Fixed Sidebar */}
                <Sidebar />
                {/* <Smile /> */}
                {/* Main Content Area */}
                <main className="flex-1 lg:ml-sidebar min-h-svh overflow-x-hidden">
                    <div className="px-4 pt-24 pb-6 lg:px-8 lg:py-10 w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
