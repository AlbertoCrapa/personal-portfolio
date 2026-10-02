import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import SectionHeader from '../../components/ui/SectionHeader';
import ProjectCard from '../../components/ui/ProjectCard';
import Button from '../../components/ui/Button';
import SocialLink from '../../components/ui/SocialLink';
import VideoHero from '../../components/ui/VideoHero';
import Icon from '../../components/ui/Icon';
import Reveal from '../../components/ui/motion/Reveal';
import BouncyAccordion from '../../components/ui/motion/BouncyAccordion';
import { ShimmerText } from '../../components/ui/NavAnimations';
import { useTheme } from '../../components/ui/ThemeProvider';
import {
    EASE_OUT,
    SPRING_PRESS,
    SPRING_SWAP,
    useReducedMotion,
} from '../../utils/motion';
import { estimateReadTime, formatDate } from '../../utils/utils';
import projectData from '../../data/projects.json';
import playgroundData from '../../data/playground.json';
import blogData from '../../data/blog.json';
import data from '../../data/data.json';

/* Sections that are built but not published yet. These are real flags, not
   commented-out blocks: flip one and the section below comes back wired up. */
const SHOW_TESTIMONIALS = false;
const SHOW_TRAVEL_MAP = false;

/* maplibre-gl is ~275 kB gzipped and the map lives behind a flag, so it is
   split out: with the row off, the homepage bundle never pays for it. */
const TravelMapCard = React.lazy(() => import('../../components/ui/TravelMapCard'));

/* ─────────────────────────────────────────────────────
   DraggableStrip — infinite horizontal scroller
   ───────────────────────────────────────────────────── */

const DraggableStrip = ({ children, className = '', label = '' }) => {
    const stripRef = React.useRef(null);
    const rafRef = React.useRef(null);
    const dragState = React.useRef({ active: false, startX: 0, scrollLeft: 0, currentScroll: 0 });
    const hoverRef = React.useRef(false);
    const [isDragging, setIsDragging] = React.useState(false);

    React.useEffect(() => {
        const el = stripRef.current;
        if (!el) return undefined;
        const speed = 0.5;

        const tick = () => {
            if (!dragState.current.active && !hoverRef.current && el.scrollWidth > el.clientWidth) {
                dragState.current.currentScroll += speed;
                // Reset when a third of the way through (content is tripled)
                if (dragState.current.currentScroll >= el.scrollWidth / 3) {
                    dragState.current.currentScroll -= el.scrollWidth / 3;
                }
                el.scrollLeft = dragState.current.currentScroll;
            } else {
                dragState.current.currentScroll = el.scrollLeft;
            }
            rafRef.current = window.requestAnimationFrame(tick);
        };

        rafRef.current = window.requestAnimationFrame(tick);
        return () => window.cancelAnimationFrame(rafRef.current);
    }, []);

    const onPointerDown = (e) => {
        const el = stripRef.current;
        if (!el) return;
        dragState.current.active = true;
        dragState.current.startX = e.pageX - el.offsetLeft;
        dragState.current.scrollLeft = el.scrollLeft;
        setIsDragging(true);
        el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
        const el = stripRef.current;
        if (!el || !dragState.current.active) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        el.scrollLeft = dragState.current.scrollLeft - (x - dragState.current.startX) * 1.5;
        dragState.current.currentScroll = el.scrollLeft;
    };

    const stopDragging = () => {
        dragState.current.active = false;
        setIsDragging(false);
    };

    return (
        <div
            ref={stripRef}
            className={`overflow-x-auto hide-scrollbar select-none touch-pan-x ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${className}`}
            onMouseEnter={() => { hoverRef.current = true; }}
            onMouseLeave={() => { hoverRef.current = false; stopDragging(); }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={stopDragging}
            onPointerCancel={stopDragging}
            aria-label={label}
        >
            <div className="flex items-stretch gap-3 min-w-max px-1">
                {children}
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────
   SweepTitle — per-character colour sweep radiating out
   from the cursor, the same language as the nav shimmer.
   ───────────────────────────────────────────────────── */

const SweepTitle = ({ text }) => {
    const scope = React.useRef(null);

    const sweep = (target, delayFrom) => {
        const container = scope.current;
        if (!container) return;
        Array.from(container.children).forEach((el, i) => {
            el.style.transitionDelay = `${Math.abs(i - delayFrom) * 30}ms`;
            el.style.color = target;
        });
    };

    const handleMouseEnter = (e) => {
        const container = scope.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const charWidth = rect.width / (text.length || 1);
        const startIndex = Math.max(
            0,
            Math.min(text.length - 1, Math.floor((e.clientX - rect.left) / charWidth)),
        );
        sweep('var(--color-text-secondary)', startIndex);
    };

    const handleMouseLeave = () => sweep('var(--color-text-primary)', 0);

    return (
        <span ref={scope} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {text.split('').map((char, i) => (
                <span
                    key={i}
                    style={{
                        color: 'var(--color-text-primary)',
                        transition: 'color 40ms linear',
                    }}
                >
                    {char === ' ' ? ' ' : char}
                </span>
            ))}
        </span>
    );
};

/* ─────────────────────────────────────────────────────
   PostRow — Recent Posts as an index row: date rail,
   shimmer title, cover slides in on hover.
   ───────────────────────────────────────────────────── */

const PostRow = ({ blog }) => {
    const reduce = useReducedMotion();
    const [hovered, setHovered] = React.useState(false);
    const coverSrc = blog.cover || blog.media?.[0]?.src;

    return (
        <motion.div
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            whileTap={reduce ? undefined : { scale: 0.995 }}
            transition={SPRING_PRESS}
        >
            <Link
                to={`/blog/${blog.slug}`}
                onFocus={() => setHovered(true)}
                onBlur={() => setHovered(false)}
                className="group relative grid grid-cols-1 gap-1 px-2 py-4 md:grid-cols-[7rem_1fr_auto] md:items-center md:gap-6"
            >
                <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-xl bg-surface"
                    animate={{ opacity: hovered ? 0.6 : 0 }}
                    transition={{ duration: 0.22, ease: EASE_OUT }}
                />

                <span className="relative text-xs lowercase leading-snug text-text-muted">
                    {formatDate(blog.date)}
                </span>

                <span className="relative min-w-0">
                    <span className="block font-display text-base font-bold leading-snug md:text-lg">
                        <SweepTitle text={blog.title} />
                    </span>
                    {blog.excerpt && (
                        <span className="mt-1 line-clamp-2 block max-w-2xl text-sm text-text-secondary">
                            {blog.excerpt}
                        </span>
                    )}
                    <span className="mt-1 block text-xs text-text-muted md:hidden">
                        {estimateReadTime(blog)} min read
                    </span>
                </span>

                {coverSrc && (
                    <motion.span
                        className="relative hidden h-20 w-32 overflow-hidden rounded-lg md:block"
                        initial={false}
                        animate={
                            reduce
                                ? { opacity: hovered ? 1 : 0 }
                                : {
                                    opacity: hovered ? 1 : 0,
                                    x: hovered ? 0 : 10,
                                    scale: hovered ? 1 : 0.96,
                                }
                        }
                        transition={SPRING_SWAP}
                    >
                        <img
                            src={coverSrc}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                            onError={(e) => { e.target.parentElement.style.visibility = 'hidden'; }}
                        />
                    </motion.span>
                )}
            </Link>
        </motion.div>
    );
};

/* ─────────────────────────────────────────────────────
   ScrambleLines — the logo's scramble effect adapted to
   wrapping multi-word text. Each slot reserves its final
   width so lines never reflow mid-scramble.
   ───────────────────────────────────────────────────── */

const SCRAMBLE_CHARS = 'abcdefghijklmnopqrstuvwxyz#@!?$%';

// Scramble glyphs sit off the final colour so the reveal reads. On a light
// canvas that means darker than the text, not lighter.
const randGray = (isDark) => {
    const v = isDark
        ? Math.floor(Math.random() * 60) + 150 // 150–209 on near-black
        : Math.floor(Math.random() * 60) + 110; // 110–169 on near-white
    return `rgb(${v},${v},${v})`;
};

const prefersReducedMotionNow = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ScrambleLines = ({ text }) => {
    const { theme } = useTheme();
    const isDark = theme !== 'light';
    const [display, setDisplay] = React.useState(() =>
        text.split('').map((c) => ({ char: c, color: null })),
    );
    const prevRef = React.useRef(text);

    React.useEffect(() => {
        if (prevRef.current === text) return undefined;
        prevRef.current = text;
        if (prefersReducedMotionNow()) {
            setDisplay(text.split('').map((c) => ({ char: c, color: null })));
            return undefined;
        }
        let cancelled = false;
        const steps = 16;
        const stepMs = 26;
        (async () => {
            for (let step = 0; step <= steps; step++) {
                if (cancelled) return;
                const revealed = Math.floor((step / steps) * text.length);
                setDisplay(
                    text.split('').map((c, i) => {
                        if (c === ' ' || i < revealed) return { char: c, color: null };
                        return {
                            char: SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
                            color: randGray(isDark),
                        };
                    }),
                );
                await new Promise((r) => setTimeout(r, stepMs));
            }
            if (!cancelled) setDisplay(text.split('').map((c) => ({ char: c, color: null })));
        })();
        return () => { cancelled = true; };
    }, [text, isDark]);

    // Group characters into words so the browser wraps between them, never inside.
    const words = [];
    let current = [];
    text.split('').forEach((c, i) => {
        if (c === ' ') {
            if (current.length) words.push(current);
            current = [];
        } else {
            current.push({ char: c, index: i });
        }
    });
    if (current.length) words.push(current);

    return (
        <span>
            {words.map((word, w) => (
                <React.Fragment key={w}>
                    {w > 0 && ' '}
                    <span className="inline-block whitespace-nowrap">
                        {word.map(({ char, index }) => {
                            const d = display[index];
                            return (
                                <span key={index} style={{ position: 'relative', display: 'inline-block' }}>
                                    <span aria-hidden="true" style={{ visibility: 'hidden' }}>{char}</span>
                                    <span
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            color: d?.color || 'inherit',
                                        }}
                                    >
                                        {d ? d.char : char}
                                    </span>
                                </span>
                            );
                        })}
                    </span>
                </React.Fragment>
            ))}
        </span>
    );
};

/* ─────────────────────────────────────────────────────
   QuotePanel
   ───────────────────────────────────────────────────── */

const QuotePanel = ({ quotes = [] }) => {
    const items = quotes.map((q) => (typeof q === 'string' ? { text: q, author: null } : q));
    const [index, setIndex] = React.useState(0);
    const hoverRef = React.useRef(false);

    React.useEffect(() => {
        if (items.length < 2) return undefined;
        const timer = setInterval(() => {
            if (!hoverRef.current) setIndex((i) => (i + 1) % items.length);
        }, 9000);
        return () => clearInterval(timer);
    }, [items.length]);

    if (!items.length) return null;
    const quote = items[index];
    const next = () => setIndex((i) => (i + 1) % items.length);

    return (
        <div
            role="button"
            tabIndex={0}
            aria-label="Show next quote"
            className="w-full cursor-pointer select-none focus:outline-none"
            onClick={next}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    next();
                }
            }}
            onMouseEnter={() => { hoverRef.current = true; }}
            onMouseLeave={() => { hoverRef.current = false; }}
        >
            <blockquote className="relative border-l-2 border-text-primary/25 pl-5 md:pl-8">
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-6 left-3 select-none font-display text-7xl leading-none text-text-primary/10 md:-top-10 md:left-6 md:text-9xl"
                >
                    &ldquo;
                </span>
                <p className="relative font-display text-2xl font-semibold leading-tight tracking-tight text-text-primary md:text-4xl lg:text-5xl">
                    <ScrambleLines text={quote.text} />
                </p>
            </blockquote>
            <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pl-5 md:pl-8">
                {quote.author && (
                    <p className="text-sm text-text-secondary">
                        <span className="text-text-muted">/</span> {quote.author}
                    </p>
                )}
                <p className="text-xs lowercase text-text-muted">tap for next</p>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────
   AboutAccordion — everything that used to hide behind a
   single-tab console, now readable in place.
   ───────────────────────────────────────────────────── */

/**
 * TrackRow — one line of the "in my ears" tracklist.
 *
 * Music and podcasts are the same thing to a listener, so they share one
 * numbered list instead of sitting in two different widgets: the live track
 * takes the index slot with an equaliser, everything else gets its number.
 */
const TrackRow = ({ index, kind, title, meta, url, playing = false }) => {
    const reduce = useReducedMotion();
    const Component = url ? motion.a : motion.div;

    return (
        <Component
            {...(url ? { href: url, target: '_blank', rel: 'noopener noreferrer' } : {})}
            whileHover={reduce || !url ? undefined : { x: 3 }}
            transition={SPRING_PRESS}
            className={`group flex items-center gap-3 border-b border-border py-2.5 last:border-0 ${url ? 'cursor-pointer' : ''}`}
        >
            <span className="flex w-7 flex-shrink-0 justify-center">
                {playing ? (
                    <span className="eq-bars" aria-hidden="true"><span /><span /><span /><span /></span>
                ) : (
                    <span className="text-xs tabular-nums text-text-muted">{index}</span>
                )}
            </span>

            <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-text-primary">{title}</span>
                {meta && <span className="block truncate text-xs text-text-muted">{meta}</span>}
            </span>

            <span className="flex-shrink-0 text-xs lowercase text-text-muted">
                {kind}
            </span>

            {url && (
                <svg className="h-3.5 w-3.5 flex-shrink-0 text-text-muted transition-colors group-hover:text-accent-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 4h6v6M10 14 20 4M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />
                </svg>
            )}
        </Component>
    );
};

const AboutAccordion = ({ about = {}, extras = {}, skills = [], spotify = {} }) => {
    // Tripled so the marquee can wrap without a visible seam.
    const tripleSkills = React.useMemo(() => [...skills, ...skills, ...skills], [skills]);

    // The data has carried both shapes over the years.
    const podcasts = React.useMemo(
        () => (extras.podcasts || []).map((p) => (typeof p === 'string' ? { name: p } : p)),
        [extras.podcasts],
    );

    const rows = [
        (about.description || about.description2) && {
            id: 'who',
            title: 'who i am',
            meta: about.location,
            content: (
                <div className="max-w-2xl space-y-3 text-sm leading-relaxed text-text-secondary">
                    {about.description && <p>{about.description}</p>}
                    <div className="pt-1">
                        <span className="status-pill">
                            <span className="status-dot" aria-hidden="true" />
                            Open to work
                        </span>
                    </div>
                </div>
            ),
        },
        (extras.interests || []).length > 0 && {
            id: 'interests',
            title: 'what i’m into',
            meta: `${extras.interests.length} rabbit holes`,
            content: (
                // A ruled, numbered index rather than a chip cloud: these are
                // subjects, and subjects read as a list.
                <ol className="grid gap-x-10 sm:grid-cols-2">
                    {extras.interests.map((interest, i) => (
                        <li
                            key={interest.label}
                            className="flex items-baseline gap-3 border-b border-border py-2 text-sm text-text-secondary last:border-0 sm:[&:nth-last-child(2)]:border-0"
                        >
                            <span className="w-5 text-xs tabular-nums text-text-muted">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <Icon name={interest.icon} className="h-4 w-4 self-center text-text-muted" />
                            <span className="text-text-primary">{interest.label}</span>
                        </li>
                    ))}
                </ol>
            ),
        },
        (podcasts.length > 0 || spotify.nowPlaying) && {
            id: 'ears',
            title: 'in my ears',
            meta: spotify.nowPlaying ? `now: ${spotify.nowPlaying}` : `${podcasts.length} on rotation`,
            content: (
                <div className="max-w-2xl space-y-3">
                    <div>
                        {spotify.nowPlaying && (
                            <TrackRow
                                playing
                                kind="playing"
                                title={spotify.nowPlaying}
                                meta={[spotify.artist, spotify.album].filter(Boolean).join(' · ')}
                            />
                        )}
                        {podcasts.map((podcast, i) => (
                            <TrackRow
                                key={podcast.name || i}
                                index={String(i + 1).padStart(2, '0')}
                                kind="podcast"
                                title={podcast.name}
                                url={podcast.url}
                            />
                        ))}
                    </div>
                    {(spotify.topArtists || []).length > 0 && (
                        <p className="text-xs text-text-muted">
                            On repeat: {spotify.topArtists.join(' · ')}
                        </p>
                    )}
                    <p className="text-xs text-text-muted">Mostly while walking or commuting.</p>
                </div>
            ),
        },
        skills.length > 0 && {
            id: 'stack',
            title: 'the stack i reach for',
            meta: `${skills.length} tools`,
            content: (
                <div className="space-y-3">
                    <DraggableStrip label="Tools and technologies I work with">
                        {tripleSkills.map((skill, i) => (
                            <span key={`${skill}-${i}`} className="skill-chip">{skill}</span>
                        ))}
                    </DraggableStrip>
                    <p className="text-xs text-text-muted">Drag the strip — it keeps moving on its own.</p>
                </div>
            ),
        },
        SHOW_TRAVEL_MAP && {
            id: 'map',
            title: 'where i’ve been',
            content: (
                <React.Suspense fallback={<div className="h-48 rounded-xl border border-border bg-bg" />}>
                    <TravelMapCard bare />
                </React.Suspense>
            ),
        },
    ].filter(Boolean);

    if (!rows.length) return null;

    return <BouncyAccordion items={rows} defaultOpenId={rows[0].id} />;
};

/* ─────────────────────────────────────────────────────
   AvailabilityCard — the third module in the right rail.
   Two modules left the column half the height of the
   project stack beside it; this one closes that gap with
   the thing a visitor most often wants next.
   ───────────────────────────────────────────────────── */

const AvailabilityCard = ({ contact = {}, about = {} }) => {
    const reduce = useReducedMotion();

    return (
        <motion.section
            whileHover={reduce ? undefined : { y: -2 }}
            transition={SPRING_PRESS}
            className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--card-shadow)] lg:p-6"
        >
            <p className="mb-3 text-xs font-semibold lowercase text-text-muted">
                Currently
            </p>

            {about.location && (
                <p className="text-xs text-text-muted">{about.location}</p>
            )}

            <a
                href={`mailto:${contact.email || 'hello@albyeah.com'}`}
                className="mt-4 block break-all font-display text-base font-semibold"
            >
                <ShimmerText
                    text={contact.email || 'hello@albyeah.com'}
                    inactiveColor="var(--color-text-primary)"
                    hoverColor="var(--color-text-secondary)"
                />
            </a>

            <a
                href="#contact"
                className="mt-3 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
                Send a message
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
            </a>
        </motion.section>
    );
};

/* ─────────────────────────────────────────────────────
   HOME PAGE
   ───────────────────────────────────────────────────── */

const Home = () => {
    const news = data.news;
    const contact = data.contact;
    const homeConfig = data.homepage || {};
    const projects = Object.values(projectData.projects);
    const playgroundItems = (playgroundData.playground || []).filter((item) => !item.hidden);
    const blogs = blogData.blogs;
    const hero = homeConfig.hero || {};
    const reel = homeConfig.reel || {};
    const extras = homeConfig.extras || {};
    const skills = homeConfig.skills || [];

    const featuredProjects = projects.slice(0, 3);
    const testimonials = React.useMemo(() => {
        const t = homeConfig.testimonials || [];
        return [...t, ...t, ...t];
    }, [homeConfig.testimonials]);

    // Direct channels for the contact section
    const socialLinks = [
        contact?.github && { label: 'Github', url: contact.github, hoverColor: 'hover:text-[#beabf6ff]', glowColor: '#8a5cf633' },
        contact?.linkedin && { label: 'LinkedIn', url: contact.linkedin, hoverColor: 'hover:text-[#7DD3FC]', glowColor: '#0a66c22e' },
        contact?.instagram && { label: 'Instagram', url: contact.instagram, hoverColor: 'hover:text-[#f5a9d0ff]', glowColor: '#e4405e2e' },
        contact?.itchio && { label: 'Itch.io', url: contact.itchio, hoverColor: 'hover:text-[#FCA5A5]', glowColor: '#fa5c5c34' },
    ].filter(Boolean);

    // Parse news text with simple markdown links [text](url)
    const parseNewsText = (text) => {
        if (!text) return null;
        return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
            const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (!match) return part;
            const isExternal = /^https?:\/\//.test(match[2]);
            return isExternal ? (
                <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="font-medium text-accent-blue hover:underline">
                    {match[1]}
                </a>
            ) : (
                <Link key={i} to={match[2]} className="font-medium text-accent-blue hover:underline">
                    {match[1]}
                </Link>
            );
        });
    };

    return (
        <>
            <SEO
                title="Alberto Crapanzano - Game Technical Designer & Creative Developer"
                description="Alberto Crapanzano (Albyeah) is a Creative Developer specializing in game Technical Design and Programming. Expert in Unity, Unreal Engine, and digital experiences."
                keywords="Alberto Crapanzano, Albyeah, Game Developer, Technical Designer, Creative Developer, Unity, Unreal Engine"
                url="/"
                isHomepage={true}
            />

            {/* ── Full-viewport video hero ── */}
            {/* page-bleed cancels the shell's gutter; -mt cancels py-8/py-10 */}
            <div className="page-bleed -mt-8 lg:-mt-10">
                <VideoHero reel={reel} contact={contact} hero={hero} />
            </div>

            <div className="mt-8 space-y-12 lg:mt-10 lg:space-y-16">
                <Breadcrumb items={[{ label: 'home', path: '/' }]} />

                {/* ──────────── PROJECTS + SIDEBAR ──────────── */}
                <Reveal blur={0} amount={0.05}>
                    <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-12 lg:gap-x-8">
                        {/* The header is its own grid row so the rail beside
                            the projects starts level with the first card. */}
                        <SectionHeader title="Featured Projects" seeAllLink="/projects" className="lg:col-span-7" />

                        {/* self-start is load-bearing at *every* breakpoint: a
                            stretched grid item has a definite height, which the
                            featured card's `h-full` then resolves against —
                            blowing the card up to the whole column and pushing
                            the cards under it out of the section, on top of the
                            next one. A single-column grid stretches its rows too,
                            so this is not a desktop-only problem. */}
                        <section className="space-y-4 self-start lg:col-span-7 lg:col-start-1">
                            {featuredProjects[0] && (
                                <ProjectCard project={featuredProjects[0]} size="wide" />
                            )}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {featuredProjects.slice(1, 3).map((project) => (
                                    <ProjectCard key={project.slug} project={project} size="medium" />
                                ))}
                            </div>
                        </section>

                        {/* Stretches to the project column's height; the modules
                            spread so top and bottom edges line up with it. */}
                        <aside className="mt-2 flex flex-col justify-between gap-8 lg:col-span-5 lg:col-start-8 lg:mt-0">
                            {news && (
                                <motion.section
                                    whileHover={{ y: -2 }}
                                    transition={SPRING_PRESS}
                                    className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--card-shadow)] lg:p-6"
                                >
                                    <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                                        {parseNewsText(news.text)}
                                    </p>
                                    {news.buttonLink && (
                                        <Button href={news.buttonLink} variant="quiet" size="md" fullWidth>
                                            {news.buttonIcon === 'play' && (
                                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M21 12l-18 12v-24l18 12z" />
                                                </svg>
                                            )}
                                            {news.buttonText || 'Learn More'}
                                        </Button>
                                    )}
                                </motion.section>
                            )}

                            <section>
                                <SectionHeader title="Playground" seeAllLink="/playground" />
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {playgroundItems.slice(0, 4).map((item) => (
                                        <ProjectCard key={item.slug} project={item} size="small" basePath="/playground" />
                                    ))}
                                </div>
                            </section>

                            <AvailabilityCard contact={contact} about={data.about || {}} />
                        </aside>
                    </div>
                </Reveal>

                {/* ──────────── TESTIMONIALS — scrolling strip ──────────── */}
                {SHOW_TESTIMONIALS && testimonials.length > 0 && (
                    <Reveal blur={0}>
                        <section className="space-y-5">
                            <SectionHeader title="What People Say" />
                            <DraggableStrip className="rounded-2xl border border-border bg-surface/60 px-2 py-4" label="Testimonials from collaborators">
                                {testimonials.map((item, idx) => (
                                    <article
                                        key={`${item.name}-${idx}`}
                                        className="flex w-[300px] flex-shrink-0 flex-col justify-between p-4 md:w-[340px] md:p-5"
                                    >
                                        <div className="testimonial-quote">
                                            <p className="text-sm italic leading-relaxed text-text-secondary">
                                                &ldquo;{item.quote}&rdquo;
                                            </p>
                                        </div>
                                        <div className="mt-4 border-t border-border pt-3">
                                            <p className="text-sm font-semibold text-text-primary">{item.name}</p>
                                            <div className="mt-0.5 flex items-center justify-between gap-2">
                                                {item.role && <p className="text-xs text-text-muted">{item.role}</p>}
                                                <p className="text-xs text-text-muted">{formatDate(item.date)}</p>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </DraggableStrip>
                        </section>
                    </Reveal>
                )}

                {/* ──────────── BLOG PREVIEW — index rows ──────────── */}
                {blogs.length > 0 && (
                    <Reveal blur={0}>
                        <section>
                            <SectionHeader title="Recent Blog Posts" seeAllLink="/blog" />
                            <div className="divide-y divide-border border-b border-border">
                                {blogs.slice(0, 3).map((blog) => (
                                    <PostRow key={blog.slug} blog={blog} />
                                ))}
                            </div>
                        </section>
                    </Reveal>
                )}

                {/* ──────────── MORE ABOUT ME — bouncy accordion ──────────── */}
                <Reveal blur={0}>
                    <section className="space-y-4">
                        <SectionHeader
                            title="More about me"
                            meta={<span className="text-xs text-text-muted">open a drawer</span>}
                        />
                        <AboutAccordion about={data.about} extras={extras} skills={skills} spotify={homeConfig.spotify || {}} />
                    </section>
                </Reveal>

                {/* ──────────── QUOTES ──────────── */}
                {(extras.favoriteQuotes || []).length > 0 && (
                    <Reveal blur={0}>
                        <section className="space-y-6">
                            <SectionHeader title="Quotes" />
                            <QuotePanel quotes={extras.favoriteQuotes} />
                        </section>
                    </Reveal>
                )}

                {/* ──────────── CONTACT ──────────── */}
                <Reveal blur={0}>
                    <section id="contact" className="space-y-8 border-t border-border pt-10">
                        <div className="space-y-3">
                            <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
                                let&apos;s talk
                            </h2>
                            <p className="max-w-xl leading-relaxed text-text-secondary">
                                {data.about?.description2 || 'Interested in working together? Drop me a message.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
                            <div className="space-y-8 lg:col-span-5">
                                <div>
                                    <p className="mb-2 text-xs lowercase text-text-muted">Write me directly</p>
                                    <a href={`mailto:${contact?.email || 'hello@albyeah.com'}`} className="inline-block break-all font-display text-lg font-semibold md:text-xl">
                                        <ShimmerText
                                            text={contact?.email || 'hello@albyeah.com'}
                                            inactiveColor="var(--color-text-primary)"
                                            hoverColor="var(--color-text-secondary)"
                                        />
                                    </a>
                                </div>

                                {socialLinks.length > 0 && (
                                    <div>
                                        <p className="mb-2 text-xs lowercase text-text-muted">Elsewhere</p>
                                        <ul className="space-y-1">
                                            {socialLinks.map((link) => (
                                                <li key={link.label}>
                                                    <SocialLink href={link.url} hoverColor={link.hoverColor} glowColor={link.glowColor}>
                                                        {link.label}
                                                    </SocialLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {contact?.cv && (
                                    <motion.a
                                        href={contact.cv}
                                        download
                                        whileHover={{ x: 2 }}
                                        whileTap={{ scale: 0.97 }}
                                        transition={SPRING_PRESS}
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-[#86EFAC]"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        <span>Download CV</span>
                                    </motion.a>
                                )}
                            </div>

                            <div className="lg:col-span-7">
                                <ContactForm email={contact?.email} />
                            </div>
                        </div>
                    </section>
                </Reveal>
            </div>
        </>
    );
};

/* ─────────────────────────────────────────────────────
   ContactForm
   ───────────────────────────────────────────────────── */

const Field = ({ id, label, children }) => (
    <div className="space-y-1.5">
        <label htmlFor={id} className="text-sm font-medium text-text-secondary">{label}</label>
        {children}
    </div>
);

const ContactForm = ({ email = 'hello@albyeah.com' }) => {
    const [formData, setFormData] = React.useState({ email: '', subject: '', message: '' });
    const [focused, setFocused] = React.useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.email}\n\n${formData.message}`)}`;
        window.location.href = mailtoLink;
    };

    // The focused border is animated rather than transitioned so it settles on
    // the same curve as every other surface on the page.
    const fieldProps = (name) => ({
        value: formData[name],
        onChange: (e) => setFormData({ ...formData, [name]: e.target.value }),
        onFocus: () => setFocused(name),
        onBlur: () => setFocused(null),
        required: true,
        className: 'w-full rounded-lg border bg-surface px-4 py-3 text-text-primary outline-none transition-colors duration-200 placeholder:text-text-muted',
        style: {
            borderColor:
                focused === name ? 'var(--color-accent-blue)' : 'var(--color-border)',
        },
    });

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field id="contact-email" label="Email">
                    <input id="contact-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" {...fieldProps('email')} />
                </Field>
                <Field id="contact-subject" label="Subject">
                    <input id="contact-subject" name="subject" type="text" placeholder="Project collaboration" autoComplete="off" {...fieldProps('subject')} />
                </Field>
            </div>
            <Field id="contact-message" label="Message">
                <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Tell me about your project, team, or role."
                    rows={6}
                    {...fieldProps('message')}
                    className={`${fieldProps('message').className} resize-none`}
                />
            </Field>
            <div className="flex flex-wrap items-center gap-4">
                <Button type="submit" variant="quiet" size="md">Send Message</Button>
                <p className="text-xs text-text-muted">Sends through your own mail app. Nothing is stored.</p>
            </div>
        </form>
    );
};

export default Home;
