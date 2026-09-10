import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useAnimate } from 'framer-motion';

import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import SectionHeader from '../../components/ui/SectionHeader';
import ProjectCard from '../../components/ui/ProjectCard';
import Button from '../../components/ui/Button';
import SocialLink from '../../components/ui/SocialLink';
import TravelMapCard from '../../components/ui/TravelMapCard';
import VideoHero from '../../components/ui/VideoHero';
import { ShimmerText } from '../../components/ui/NavAnimations';
import projectData from '../../data/projects.json';
import playgroundData from '../../data/playground.json';
import blogData from '../../data/blog.json';
import data from '../../data/data.json';

/* ─────────────────────────────────────────────────────
   RevealSection — unified scroll‑reveal for ALL sections
   ───────────────────────────────────────────────────── */

const RevealSection = ({ children, className = '', delay = 0 }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.06 });

  return (
    <div
      ref={ref}
      className={`homepage-reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
};

/* ─────────────────────────────────────────────────────
   DraggableStrip — reusable infinite horizontal scroller
   Used for both Skills and Testimonials
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
        // Reset when half‑way (content is tripled)
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
   SweepTitle — per-character color sweep that radiates out
   from the cursor's position on hover (same language as the
   nav / table-of-contents shimmer). Uses a plain inline span
   so long titles still wrap by word, not mid-character.
   ───────────────────────────────────────────────────── */

const SweepTitle = ({ text }) => {
  const [scope, animate] = useAnimate();

  const handleMouseEnter = (e) => {
    const container = scope.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const charWidth = rect.width / (text.length || 1);
    const startIndex = Math.max(0, Math.min(text.length - 1, Math.floor(mouseX / charWidth)));
    Array.from(container.children).forEach((el, i) =>
      animate(el, { color: '#a0a0a0' }, { duration: 0.04, delay: Math.abs(i - startIndex) * 0.03 }),
    );
  };

  const handleMouseLeave = () => {
    const container = scope.current;
    if (!container) return;
    Array.from(container.children).forEach((el) =>
      animate(el, { color: '#ffffff' }, { duration: 0.15 }),
    );
  };

  return (
    <span ref={scope} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {text.split('').map((char, i) => (
        <span key={i} style={{ color: '#ffffff' }}>
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  );
};

/* ─────────────────────────────────────────────────────
   PostRow — Recent Posts as an index row: date rail,
   shimmer title, cover slides in on hover (echoes the
   ProjectCard hover-media behavior).
   ───────────────────────────────────────────────────── */

const PostRow = ({ blog }) => {
  const coverSrc = blog.cover || blog.media?.[0]?.src;
  const dateLabel = new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="group grid grid-cols-1 gap-1 md:grid-cols-[7rem_1fr_auto] md:items-center md:gap-6 py-4 px-2 -mx-2 transition-colors hover:bg-surface/30"
    >
      <span className="text-xs uppercase tracking-wider text-text-muted leading-snug">
        {dateLabel}
      </span>
      <span className="min-w-0">
        <span className="block text-base md:text-lg font-bold leading-snug">
          <SweepTitle text={blog.title} />
        </span>
        {blog.excerpt && (
          <span className="line-clamp-2 text-sm text-text-secondary mt-1 max-w-2xl">
            {blog.excerpt}
          </span>
        )}
      </span>
      {coverSrc && (
        <span className="hidden md:block w-32 h-20 rounded-lg overflow-hidden opacity-0 translate-x-2 scale-[0.97] group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 transition-all duration-500 ease-out">
          <img
            src={coverSrc}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.parentElement.style.visibility = 'hidden'; }}
          />
        </span>
      )}
    </Link>
  );
};

/* ─────────────────────────────────────────────────────
   ScrambleLines — the logo's scramble effect, adapted to
   wrapping multi-word text. Each character slot reserves
   its final width so lines never reflow mid-scramble.
   ───────────────────────────────────────────────────── */

const SCRAMBLE_CHARS = 'abcdefghijklmnopqrstuvwxyz#@!?$%';

const randGray = () => {
  const v = Math.floor(Math.random() * 60) + 150; // 150–209
  return `rgb(${v},${v},${v})`;
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ScrambleLines = ({ text }) => {
  const [display, setDisplay] = React.useState(() =>
    text.split('').map((c) => ({ char: c, color: null }))
  );
  const prevRef = React.useRef(text);

  React.useEffect(() => {
    if (prevRef.current === text) return undefined;
    prevRef.current = text;
    if (prefersReducedMotion()) {
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
              color: randGray(),
            };
          })
        );
        await new Promise((r) => setTimeout(r, stepMs));
      }
      if (!cancelled) setDisplay(text.split('').map((c) => ({ char: c, color: null })));
    })();
    return () => { cancelled = true; };
  }, [text]);

  // Group characters into word chunks so the browser wraps
  // between words, never inside them.
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
   Curiosities console — More About Me as a single tabbed
   module. Tab rail reuses the topbar grammar (lowercase
   labels, "/" separators, shimmer active state).
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
      <blockquote className="relative pl-5 md:pl-8 border-l-2 border-text-primary/25">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 md:-top-10 left-3 md:left-6 font-display text-7xl md:text-9xl leading-none text-text-primary/10 select-none"
        >
          &ldquo;
        </span>
        <p className="relative font-display text-2xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight text-text-primary">
          <ScrambleLines text={quote.text} />
        </p>
      </blockquote>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mt-6 pl-5 md:pl-8">
        {quote.author && (
          <p className="text-sm text-text-secondary">
            <span className="text-text-muted">/</span> {quote.author}
          </p>
        )}
        <p className="text-xs uppercase tracking-wider text-text-muted">
          tap for next
        </p>
      </div>
    </div>
  );
};

const PodcastPanel = ({ podcasts = [] }) => (
  <div className="space-y-4">
    <div className="flex flex-wrap gap-2.5">
      {podcasts.map((p, i) => {
        const name = typeof p === 'string' ? p : p.name;
        const url = typeof p === 'string' ? null : p.url;
        const chip = (
          <>
            <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-accent-blue transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 4h6v6" />
              <path d="M10 14 20 4" />
              <path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />
            </svg>
            {name}
          </>
        );
        return url ? (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:border-[#555] hover:bg-surface-hover transition-colors"
          >
            {chip}
          </a>
        ) : (
          <span key={i} className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text-secondary">
            {name}
          </span>
        );
      })}
    </div>
    <p className="text-xs text-text-muted">On regular rotation, mostly while walking or commuting.</p>
  </div>
);

const ListeningPanel = ({ spotify = {} }) => (
  <div className="space-y-6 max-w-2xl">
    {spotify.nowPlaying && (
      <div className="flex items-center gap-4">
        <div className="eq-bars" aria-hidden="true">
          <span /><span /><span /><span />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-text-muted">Now playing</p>
          <p className="text-base font-semibold text-text-primary truncate">{spotify.nowPlaying}</p>
          <p className="text-sm text-text-secondary truncate">
            {spotify.artist}{spotify.album ? ` · ${spotify.album}` : ''}
          </p>
        </div>
      </div>
    )}
    {spotify.topArtists?.length > 0 && (
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-text-muted">Top artists</p>
        <div className="flex flex-wrap gap-1.5">
          {spotify.topArtists.map((a) => (
            <span key={a} className="text-xs px-2.5 py-1 rounded-full border border-spotify-border text-spotify-dim bg-spotify-bg">{a}</span>
          ))}
        </div>
      </div>
    )}
    {spotify.genres?.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {spotify.genres.map((g) => (
          <span key={g} className="text-[10px] uppercase tracking-wider text-text-muted px-2 py-0.5 bg-surface border border-border rounded">{g}</span>
        ))}
      </div>
    )}
  </div>
);

const InterestsPanel = ({ interests = [] }) => (
  <div className="space-y-4">
    <div className="flex flex-wrap gap-2.5">
      {interests.map((it, i) => (
        <span key={i} className="skill-chip inline-flex items-center gap-2">
          <span aria-hidden="true">{it.emoji}</span>
          {it.label}
        </span>
      ))}
    </div>
    <p className="text-xs text-text-muted">What pulls me into rabbit holes lately.</p>
  </div>
);

// Music and map are temporarily off — uncomment an entry to bring that tab
// back. With a single entry the tab selector hides itself (see below).
const CURIO_TABS = [
  { id: 'quotes', label: 'quotes' },
  // { id: 'listening', label: 'music' },
  // { id: 'map', label: 'map' },
];

const CuriosityTabs = ({ extras = {}, spotify = {} }) => {
  const [activeTab, setActiveTab] = React.useState('quotes');

  const tabs = CURIO_TABS.filter((t) => {
    if (t.id === 'quotes') return (extras.favoriteQuotes || []).length > 0;
    if (t.id === 'podcasts') return (extras.podcasts || []).length > 0;
    if (t.id === 'listening') return Boolean(spotify.nowPlaying || spotify.topArtists?.length);
    if (t.id === 'interests') return (extras.interests || []).length > 0;
    return true; // map
  });

  if (!tabs.length) return null;
  const current = tabs.some((t) => t.id === activeTab) ? activeTab : tabs[0].id;

  return (
    <div>
      {/* Nothing to switch between while only one panel is enabled. */}
      {tabs.length > 1 && (
        <div role="tablist" aria-label="More about me" className="flex items-center flex-wrap gap-y-1 border-b border-border pb-3">
          {tabs.map((tab, i) => (
            <React.Fragment key={tab.id}>
              {i > 0 && <span className="text-text-muted text-sm select-none mx-3" aria-hidden="true">/</span>}
              <button
                type="button"
                role="tab"
                aria-selected={current === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="py-1 text-sm font-semibold"
              >
                <ShimmerText text={tab.label} active={current === tab.id} />
              </button>
            </React.Fragment>
          ))}
        </div>
      )}

      <div key={current} role={tabs.length > 1 ? 'tabpanel' : undefined} className={`curio-panel min-h-[12rem] ${tabs.length > 1 ? 'pt-6' : ''}`}>
        {current === 'quotes' && <QuotePanel quotes={extras.favoriteQuotes} />}
        {current === 'podcasts' && <PodcastPanel podcasts={extras.podcasts} />}
        {current === 'listening' && <ListeningPanel spotify={spotify} />}
        {current === 'interests' && <InterestsPanel interests={extras.interests} />}
        {current === 'map' && <TravelMapCard bare />}
      </div>
    </div>
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
  const playgroundItems = playgroundData.playground || [];
  const blogs = blogData.blogs;
  const hero = homeConfig.hero || {};
  const reel = homeConfig.reel || {};
  const spotify = homeConfig.spotify || {};
  const extras = homeConfig.extras || {};

  const featuredProjects = projects.slice(0, 3);
  // Triple the testimonials for smooth infinite loop
  const tripleTestimonials = React.useMemo(() => {
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
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, i) => {
      const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        const isExternal = /^https?:\/\//.test(match[2]);
        if (isExternal) {
          return (
            <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline font-medium">
              {match[1]}
            </a>
          );
        }
        return (
          <Link key={i} to={match[2]} className="text-accent-blue hover:underline font-medium">
            {match[1]}
          </Link>
        );
      }
      return part;
    });
  };

  const formatDate = (value) => {
    if (!value) return '';
    return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
      {/* -mx cancels container horizontal padding; -mt cancels py-8/py-10 top padding */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-8 lg:-mt-10">
        <VideoHero reel={reel} contact={contact} hero={hero} />
      </div>

      <div className="space-y-8 lg:space-y-8 mt-8 lg:mt-10">
        <Breadcrumb
          items={[
            { label: 'home', path: '/' },
          ]}
        />



        {/* ──────────── PROJECTS + SIDEBAR ──────────── */}
        <RevealSection>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <section className="lg:col-span-7 space-y-4">
              <SectionHeader title="Featured Projects" seeAllLink="/projects" />
              {featuredProjects[0] && (
                <ProjectCard project={featuredProjects[0]} size="large" />
              )}
              <div className="grid grid-cols-2 gap-4">
                {featuredProjects.slice(1, 3).map((project) => (
                  <ProjectCard key={project.slug} project={project} size="medium" />
                ))}
              </div>
            </section>

            <aside className="lg:col-span-5 space-y-6">
              {news && (
                <section className="bg-surface border border-border rounded-xl p-5 mt-11 lg:p-6">
                  <h2 className="text-lg font-bold text-text-primary mb-3">News</h2>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">
                    {parseNewsText(news.text)}
                  </p>
                  {news.buttonLink && (
                    <Button to={news.buttonLink} variant="primary" size="md" fullWidth>
                      <span className="flex items-center gap-2">
                        {news.buttonIcon === 'play' && (
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 12l-18 12v-24l18 12z" />
                          </svg>
                        )}
                        {news.buttonText || 'Learn More'}
                      </span>
                    </Button>
                  )}
                </section>
              )}

              <section>
                <SectionHeader title="Playground" seeAllLink="/playground" />
                <div className="grid grid-cols-2 gap-3">
                  {playgroundItems.slice(0, 4).map((item) => (
                    <ProjectCard key={item.slug} project={item} size="small" basePath="/playground" />
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </RevealSection>

        {/* ──────────── TESTIMONIALS — scrolling strip ──────────── */}
        {tripleTestimonials.length && false > 0 && (
          <RevealSection>
            <section className="space-y-5">
              <div className="flex items-baseline justify-between gap-4">
                <SectionHeader title="What People Say" className="!mb-0" />
              </div>
              <DraggableStrip className="rounded-xl border border-border bg-surface/60 py-4 px-2" label="Testimonials from collaborators">
                {tripleTestimonials.map((item, idx) => (
                  <article
                    key={`${item.name}-${idx}`}
                    className="p-4 md:p-5 w-[300px] md:w-[340px] flex-shrink-0 flex flex-col justify-between"
                  >
                    <div className="testimonial-quote">
                      <p className="text-sm text-text-secondary leading-relaxed italic">
                        "{item.quote}"
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border">
                      <p className="text-sm font-semibold text-text-primary">{item.name}</p>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        {item.role && <p className="text-xs text-text-muted">{item.role}</p>}
                        <p className="text-xs text-text-muted">{formatDate(item.date)}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </DraggableStrip>
            </section>
          </RevealSection>
        )}

        {/* ──────────── BLOG PREVIEW — index rows ──────────── */}
        {blogs.length > 0 && (
          <RevealSection>
            <section className="space-y-2">
              <SectionHeader title="Recent Blog Posts" seeAllLink="/blog" />
              <div className="border-y border-border divide-y divide-border">
                {blogs.slice(0, 3).map((blog) => (
                  <PostRow key={blog.slug} blog={blog} />
                ))}
              </div>
            </section>
          </RevealSection>
        )}

        {/* ──────────── QUOTES — curiosities console (music + map off for now) ──────────── */}
        <RevealSection>
          <section className="space-y-4">
            <SectionHeader title="Quotes" />
            <CuriosityTabs extras={extras} spotify={spotify} />
          </section>
        </RevealSection>

        {/* ──────────── CONTACT ──────────── */}
        <RevealSection>
          <section id="contact" className="pt-10 border-t border-border space-y-8">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
                  let's talk
                </h2>
              </div>
              <p className="text-text-secondary leading-relaxed max-w-xl">
                {data.about?.description2 || 'Interested in working together? Drop me a message.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <p className="text-xs uppercase tracking-wider text-text-muted mb-2">Write me directly</p>
                  <a href={`mailto:${contact?.email || 'hello@albyeah.com'}`} className="inline-block font-display text-lg md:text-xl font-semibold break-all">
                    <ShimmerText
                      text={contact?.email || 'hello@albyeah.com'}
                      inactiveColor="#ffffff"
                      hoverColor="#a0a0a0"
                    />
                  </a>
                </div>

                {socialLinks.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-text-muted mb-2">Elsewhere</p>
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
                  <a
                    href={contact.cv}
                    download
                    className="inline-flex font-semibold items-center gap-2 text-sm text-text-secondary hover:text-[#86EFAC] transition-all duration-300"
                    onMouseEnter={(e) => { e.currentTarget.style.textShadow = '0 0 8px #22c55e43, 0 0 16px rgba(34, 197, 94, 0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.textShadow = 'none'; }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download CV</span>
                  </a>
                )}
              </div>

              <div className="lg:col-span-7">
                <ContactForm email={contact?.email} />
              </div>
            </div>
          </section>
        </RevealSection>

      </div>
    </>
  );
};

/* ─────────────────────────────────────────────────────
   ContactForm
   ───────────────────────────────────────────────────── */

const ContactForm = ({ email = 'hello@albyeah.com' }) => {
  const [formData, setFormData] = React.useState({
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.email}\n\n${formData.message}`)}`;
    window.location.href = mailtoLink;
  };

  const inputClasses = 'w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="contact-email" className="text-sm font-medium text-text-secondary">Email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className={inputClasses}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="contact-subject" className="text-sm font-medium text-text-secondary">Subject</label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            placeholder="Project collaboration"
            autoComplete="off"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
            className={inputClasses}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="contact-message" className="text-sm font-medium text-text-secondary">Message</label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="Tell me about your project, team, or role."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          rows={6}
          className={`${inputClasses} resize-none`}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="primary" size="md">
          Send Message
        </Button>
        <p className="text-xs text-text-muted">Sends through your own mail app. Nothing is stored.</p>
      </div>
    </form>
  );
};

export default Home;
