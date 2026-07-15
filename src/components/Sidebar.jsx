import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import data from '../data/data.json';
import { useNotification } from './ui/NotificationProvider';
import { ShimmerNavLabel, LogoName, useNavName, NAV_FULL_NAME } from './ui/NavAnimations';

/**
 * TopNav Component
 * Fixed horizontal top navigation bar
 * Desktop: full nav with links and socials
 * Mobile: name + hamburger
 */

const allNavLinks = [
    { label: 'home', path: '/' },
    { label: 'projects', path: '/projects' },
    { label: 'playground', path: '/playground' },
    { label: 'blog', path: '/blog' },
];

const isActive = (path, pathname) => {
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(path + '/');
};

const Sidebar = () => {
    const location = useLocation();
    const navName = useNavName(location.pathname);
    const { contact } = data;
    const { notify } = useNotification();

    const socialLinks = [
        contact?.bluesky && { label: 'BlueSky', url: contact.bluesky, hoverColor: 'hover:text-[#6BB8FF]', glowColor: '#0084ff2f', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.3-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" /></svg> },
        contact?.github && { label: 'Github', url: contact.github, hoverColor: 'hover:text-[#beabf6ff]', glowColor: '#8a5cf633', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg> },
        contact?.instagram && { label: 'Instagram', url: contact.instagram, hoverColor: 'hover:text-[#f5a9d0ff]', glowColor: '#e4405e2e', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg> },
        contact?.twitch && { label: 'Twitch', url: contact.twitch, hoverColor: 'hover:text-[#C4B5FD]', glowColor: '#9046ff36', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" /></svg> },
        contact?.youtube && { label: 'Youtube', url: contact.youtube, hoverColor: 'hover:text-[#FCA5A5]', glowColor: '#ff000036', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" /></svg> },
        contact?.linkedin && { label: 'LinkedIn', url: contact.linkedin, hoverColor: 'hover:text-[#7DD3FC]', glowColor: '#0a66c22e', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
    ].filter(Boolean);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-bg border-b border-border shadow-[0_7px_22px_rgba(0,0,0,0.36)]">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-6">
                {/* Logo / Name */}
                <Link to="/" className="shrink-0">
                    <span
                        className="text-base font-bold leading-none"
                        style={{ display: 'inline-block', position: 'relative' }}
                    >
                        {/* invisible anchor — always reserves the full-name width + height */}
                        <span
                            aria-hidden="true"
                            style={{ visibility: 'hidden', whiteSpace: 'nowrap', pointerEvents: 'none' }}
                        >
                            {NAV_FULL_NAME}
                        </span>
                        {/* animated text overlaid on top */}
                        <span style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', whiteSpace: 'nowrap' }}>
                            <LogoName text={navName} />
                        </span>
                    </span>
                </Link>

                {/* Desktop nav links */}
                <nav className="hidden md:flex items-center" aria-label="Main navigation">
                    {allNavLinks.map((link, i) => (
                        <React.Fragment key={link.path}>
                            <span className="text-text-muted text-sm select-none mx-3.5">/</span>
                            <Link
                                to={link.path}
                                className="py-1.5 text-sm font-semibold"
                            >
                                <ShimmerNavLabel label={link.label} active={isActive(link.path, location.pathname)} />
                            </Link>
                        </React.Fragment>
                    ))}
                </nav>

                {/* Desktop right: socials + CV */}
                <div className="hidden lg:flex ml-20 items-center gap-4 shrink-0">
                    {socialLinks.slice(0, 4).map((link) => (
                        <a
                            key={link.label}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={link.label}
                            className={`text-text-secondary ${link.hoverColor} transition-all duration-300`}
                            onMouseEnter={(e) => { e.currentTarget.style.filter = `drop-shadow(0 0 6px ${link.glowColor})`; }}
                            onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
                        >
                            {link.icon}
                        </a>
                    ))}
                    {/* TODO: need to change the cv file download
                    {contact?.cv && (
                        <a
                            href={contact.cv}
                            download
                            className="ml-2 px-3 py-1.5 rounded-md text-xs font-semibold text-text-secondary border border-border hover:text-[#86EFAC] hover:border-[#86EFAC]/40 transition-all duration-300"
                            onClick={() => notify({ type: 'success', title: 'Download started', message: 'Your CV file is being downloaded.' })}
                        >
                            Download CV
                        </a>
                    )}
                    */}
                </div>

                {/* Mobile hamburger */}
                <MobileMenu links={allNavLinks} socialLinks={socialLinks} contact={contact} notify={notify} />
            </div>
        </header>
    );
};

/**
 * Mobile slide-down menu
 */
const MobileMenu = ({ links, socialLinks, contact, notify }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const location = useLocation();

    React.useEffect(() => {
        setIsOpen(false);
    }, [location]);

    return (
        <div className="md:hidden relative">
            <button
                onClick={() => setIsOpen((v) => !v)}
                className="p-2 text-text-primary hover:text-accent-blue transition-colors"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {isOpen ? (
                        <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
                    ) : (
                        <path strokeLinecap="round" d="M3 12h18M3 6h18M3 18h18" />
                    )}
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-surface rounded-xl shadow-xl border border-border py-2 animate-fade-in">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors ${isActive(link.path, location.pathname)
                                ? 'text-text-primary'
                                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                                }`}
                        >
                            <span className="text-text-muted">/</span>
                            {link.label}
                        </Link>
                    ))}
                    <div className="mt-2 pt-2 border-t border-border px-4 flex flex-wrap gap-x-4 gap-y-2 pb-2">
                        {socialLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={link.label}
                                className={`text-text-secondary ${link.hoverColor} transition-colors`}
                            >
                                {link.icon}
                            </a>
                        ))}
                    </div>
                    {/* TODO: need to change the cv file download
                    {contact?.cv && (
                        <div className="px-4 pb-2">
                            <a
                                href={contact.cv}
                                download
                                className="mt-1 inline-flex text-xs font-semibold text-text-secondary hover:text-[#86EFAC] transition-colors"
                                onClick={() => notify({ type: 'success', title: 'Download started', message: 'Your CV file is being downloaded.' })}
                            >
                                Download CV
                            </a>
                        </div>
                    )}
                    */}
                </div>
            )}
        </div>
    );
};

export default Sidebar;
