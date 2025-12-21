import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import data from '../data/data.json';
import NavLink from './ui/NavLink';
import SocialLink from './ui/SocialLink';

/**
 * Sidebar Component
 * Fixed on desktop, collapsible header on mobile
 * Contains: name, description, navigation, social links
 */
const Sidebar = () => {
    const location = useLocation();
    const { fullname, title, contact } = data;

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'About & Contact', path: '/about' },
    ];

    const projectLinks = [
        { label: 'Projects', path: '/projects' },
        { label: 'Playground', path: '/playground' },
        { label: 'Blog', path: '/blog' },
    ];

    // Build social links from contact data
    const socialLinks = [
        contact?.bluesky && { label: 'BlueSky', url: contact.bluesky },
        contact?.github && { label: 'Github', url: contact.github },
        contact?.instagram && { label: 'Instagram', url: contact.instagram },
        contact?.itchio && { label: 'Itch.io', url: contact.itchio },
        contact?.twitch && { label: 'Twitch', url: contact.twitch },
        contact?.youtube && { label: 'Youtube', url: contact.youtube },
        contact?.linkedin && { label: 'LinkedIn', url: contact.linkedin },
    ].filter(Boolean);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex fixed top-0 left-0 w-sidebar max-w-sidebar-max h-screen flex-col p-6 xl:p-8   overflow-y-auto bg-bg">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/" className="block">
                        <h1 className="text-xl font-bold text-text-primary hover:text-accent-blue transition-colors">
                            {fullname}
                        </h1>
                    </Link>
                    <p className="text-sm text-text-secondary mt-1">
                        {title || 'Freelance technical artist and graphic designer.'}
                    </p>
                </div>

                {/* Main Navigation */}
                <nav className="mb-6">
                    <ul className="space-y-1">
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <NavLink
                                    to={link.path}
                                    active={location.pathname === link.path}
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Project Navigation */}
                <nav className="mb-auto">
                    <ul className="space-y-1">
                        {projectLinks.map((link) => (
                            <li key={link.path}>
                                <NavLink
                                    to={link.path}
                                    active={location.pathname === link.path || location.pathname.startsWith(link.path + '/')}
                                    disabled={link.disabled}
                                    bold
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Socials */}
                <div className="mt-8 pt-6 border-t border-border">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Socials</p>
                    <ul className="space-y-1">
                        {socialLinks.map((link) => (
                            <li key={link.label}>
                                <SocialLink href={link.url}>{link.label}</SocialLink>
                            </li>
                        ))}
                    </ul>

                    {/* Download CV */}
                    {contact?.cv && (
                        <a
                            href={contact.cv}
                            download
                            className="mt-4 flex items-center gap-2 text-sm text-text-secondary hover:text-accent-blue transition-colors group"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Download CV</span>
                        </a>
                    )}
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-bg/95 backdrop-blur-sm border-b border-border">
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="block">
                            <h1 className="text-lg font-bold text-text-primary">
                                {fullname}
                            </h1>
                            <p className="text-xs text-text-secondary">
                                → About & Contact
                            </p>
                        </Link>
                        <MobileNav links={[...navLinks.slice(1), ...projectLinks]} />
                    </div>
                </div>
            </header>

            {/* Mobile spacer */}
            <div className="lg:hidden h-20" />
        </>
    );
};

/**
 * Mobile Navigation Menu
 */
const MobileNav = ({ links }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const location = useLocation();

    React.useEffect(() => {
        setIsOpen(false);
    }, [location]);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-text-primary hover:text-accent-blue transition-colors"
                aria-label="Toggle menu"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {isOpen ? (
                        <path d="M6 6l12 12M6 18L18 6" />
                    ) : (
                        <path d="M3 12h18M3 6h18M3 18h18" />
                    )}
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-lg shadow-lg border border-border py-2 animate-fade-in">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`block px-4 py-2 text-sm transition-colors ${link.disabled
                                ? 'text-text-muted cursor-not-allowed'
                                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                                }`}
                            onClick={(e) => link.disabled && e.preventDefault()}
                        >
                            → {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Sidebar;
