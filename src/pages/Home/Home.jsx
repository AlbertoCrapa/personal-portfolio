import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import Layout from '../../layouts/Layout';
import SEO from '../../components/SEO';
import SectionHeader from '../../components/ui/SectionHeader';
import ProjectCard from '../../components/ui/ProjectCard';
import Button from '../../components/ui/Button';
import SocialLink from '../../components/ui/SocialLink';
import VideoPlayer from '../../components/ui/VideoPlayer';
import { usePlatformData } from '../../hooks/usePlatformData';
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
   GitHub Activity Grid
   ───────────────────────────────────────────────────── */

const GITHUB_INTENSITY = ['#232323', '#2c2640', '#3d2f6b', '#6e54b8', '#b39af8'];

const GitHubCard = ({ github = {} }) => {
  const grid = Array.isArray(github.activity) ? github.activity : [];

  return (
    <article className="module-card module-card--github space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
          <svg className="w-4 h-4 text-github" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          GitHub
        </h3>
        <a
          href={`https://github.com/${github.username || ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-github hover:text-github font-medium hover:underline"
        >
          @{github.username || 'developer'}
        </a>
      </div>

      <div className="gh-grid">
        {grid.map((level, i) => (
          <span
            key={`gh-${i}`}
            className="gh-cell"
            style={{ backgroundColor: GITHUB_INTENSITY[Math.max(0, Math.min(4, level))] }}
            title={`Activity level: ${level}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-text-muted text-xs">Commits YTD</p>
          <p className="text-text-primary font-semibold text-lg">{github.commitsThisYear || 0}</p>
        </div>
        <div>
          <p className="text-text-muted text-xs">Pushes / month</p>
          <p className="text-text-primary font-semibold text-lg">{github.pushesThisMonth || 0}</p>
        </div>
      </div>

      <p className="text-xs text-text-secondary">{github.streak || 'Activity streak updated regularly.'}</p>
    </article>
  );
};

/* ─────────────────────────────────────────────────────
   Spotify Card
   ───────────────────────────────────────────────────── */

const SpotifyCard = ({ spotify = {} }) => (
  <article className="module-card module-card--spotify space-y-4">
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
        <svg className="w-4 h-4 text-spotify" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
        Spotify
      </h3>
      <span className="flex items-center gap-1.5 text-xs text-spotify-dim font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-spotify animate-pulse" />
        Listening now
      </span>
    </div>

    <div>
      <p className="text-text-primary font-semibold">{spotify.nowPlaying || 'No track currently available'}</p>
      <p className="text-sm text-text-secondary mt-0.5">
        {spotify.artist || 'Unknown artist'}
        {spotify.album ? ` · ${spotify.album}` : ''}
      </p>
      {spotify.lastUpdated && <p className="text-xs text-text-muted mt-1.5">{spotify.lastUpdated}</p>}
    </div>

    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wider text-text-muted">Top Artists</p>
      <div className="flex flex-wrap gap-2">
        {(spotify.topArtists || []).map((artist) => (
          <span key={artist} className="text-xs px-2.5 py-1 rounded-full border border-spotify-border text-spotify-dim bg-spotify-bg">
            {artist}
          </span>
        ))}
      </div>
    </div>

    {spotify.genres?.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {spotify.genres.map((g) => (
          <span key={g} className="text-[10px] uppercase tracking-wider text-text-muted px-2 py-0.5 bg-bg rounded">
            {g}
          </span>
        ))}
      </div>
    )}
  </article>
);

/* ─────────────────────────────────────────────────────
   LeetCode Card
   ───────────────────────────────────────────────────── */

const LeetCodeCard = ({ leetcode = {} }) => {
  const total = leetcode.solved || 0;
  const easy = leetcode.easy || 0;
  const medium = leetcode.medium || 0;
  const hard = leetcode.hard || 0;

  return (
    <article className="module-card module-card--leetcode space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
          <svg className="w-4 h-4 text-leetcode" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
          </svg>
          LeetCode
        </h3>
        <a
          href={`https://leetcode.com/u/${leetcode.username || ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-leetcode hover:underline font-medium"
        >
          Profile →
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-bg rounded-lg px-3 py-2.5 border border-border">
          <p className="text-xs text-text-muted">Solved</p>
          <p className="text-2xl font-bold text-text-primary">{total}</p>
        </div>
        <div className="bg-bg rounded-lg px-3 py-2.5 border border-border">
          <p className="text-xs text-text-muted">Contest rating</p>
          <p className="text-2xl font-bold text-text-primary">{leetcode.contestRating || 0}</p>
        </div>
      </div>

      <div className="space-y-1.5">
        {[
          { label: 'Easy', value: easy, max: total, color: '#4ade80' },
          { label: 'Medium', value: medium, max: total, color: '#fbbf24' },
          { label: 'Hard', value: hard, max: total, color: '#f87171' },
        ].map(({ label, value, max, color }) => (
          <div key={label} className="flex items-center gap-2 text-xs">
            <span className="w-14 text-text-muted">{label}</span>
            <div className="flex-1 h-1.5 bg-bg rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: max ? `${(value / max) * 100}%` : '0%', backgroundColor: color }}
              />
            </div>
            <span className="w-8 text-right text-text-secondary font-medium">{value}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-text-secondary">{leetcode.activeDays || 'Regular coding practice.'}</p>
    </article>
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

  // Live API data (GitHub + LeetCode) — falls back to data.json values
  const { github, leetcode } = usePlatformData(homeConfig);

  const featuredProjects = projects.slice(0, 3);

  // Triple the skills for smooth infinite loop
  const tripleSkills = React.useMemo(() => {
    const s = homeConfig.skills || [];
    return [...s, ...s, ...s];
  }, [homeConfig.skills]);

  // Triple the testimonials for smooth infinite loop
  const tripleTestimonials = React.useMemo(() => {
    const t = homeConfig.testimonials || [];
    return [...t, ...t, ...t];
  }, [homeConfig.testimonials]);

  // Build social links for mobile footer
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
    <Layout>
      <SEO
        title="Alberto Crapanzano - Game Technical Designer & Creative Developer"
        description="Alberto Crapanzano (Albyeah) is a Creative Developer specializing in game Technical Design and Programming. Expert in Unity, Unreal Engine, and digital experiences."
        keywords="Alberto Crapanzano, Albyeah, Game Developer, Technical Designer, Creative Developer, Unity, Unreal Engine"
        url="/"
        isHomepage={true}
      />

      <div className="space-y-10 lg:space-y-14">

        {/* ──────────── HERO + REEL ──────────── */}
        <RevealSection>
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-5 lg:gap-6">
            <article className="xl:col-span-7 bg-surface rounded-xl border border-border p-6 md:p-8 flex flex-col justify-between gap-5">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.18em] text-text-muted font-medium">
                  {hero.eyebrow || 'Creative Developer'}
                </p>
                <h1 className="font-display text-3xl md:text-[2.75rem] lg:text-5xl leading-[1.1] text-text-primary max-w-3xl">
                  {hero.title || 'I build interactive software, games, and digital experiences.'}
                </h1>
                <p className="text-text-secondary max-w-2xl text-base md:text-lg leading-relaxed">
                  {hero.description || 'A focused portfolio of technical design, real-time systems, and creative development experiments.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button to={hero.ctaLink || '/projects'} variant="primary" size="md">
                  {hero.ctaLabel || 'Explore Projects'}
                </Button>
                {contact?.github && (
                  <a href={contact.github} target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                    github profile →
                  </a>
                )}
              </div>
            </article>

            <article className="xl:col-span-5 bg-surface rounded-xl border border-border p-4 md:p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-text-primary">{reel.title || 'Video Reel'}</h2>
                <span className="text-[10px] uppercase tracking-widest text-text-muted font-semibold bg-bg px-2 py-0.5 rounded">Featured</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{reel.description || 'A short preview of selected work.'}</p>
              <VideoPlayer
                src={reel.video || '/works/deadly/videoLow.mp4'}
                poster={reel.poster || '/works/deadly/cover2.jpg'}
                className="flex-1 min-h-[14rem] md:min-h-[16rem]"
              />
            </article>
          </section>
        </RevealSection>

        {/* ──────────── CAPABILITIES STRIP ──────────── */}
        <RevealSection>
          <section className="space-y-3">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg md:text-xl font-bold text-text-primary">Capabilities</h2>
            </div>
            <DraggableStrip
              className="rounded-xl border border-border bg-surface/60 py-3 px-2"
              label="Scrolling list of skills"
            >
              {tripleSkills.map((skill, index) => (
                <span key={`${skill}-${index}`} className="skill-chip">
                  {skill}
                </span>
              ))}
            </DraggableStrip>
          </section>
        </RevealSection>

        {/* ──────────── PROJECTS + SIDEBAR ──────────── */}
        <RevealSection>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <section className="lg:col-span-7 space-y-4">
              <SectionHeader title="Projects" seeAllLink="/projects" />
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

        {/* ──────────── PLATFORM ACTIVITY ──────────── */}
        <RevealSection>
          <section className="space-y-5">
            <SectionHeader title="Platform Activity" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <GitHubCard github={github} />
              <SpotifyCard spotify={spotify} />
              <LeetCodeCard leetcode={leetcode} />
            </div>
          </section>
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

        {/* ──────────── BLOG PREVIEW ──────────── */}
        {blogs.length > 0 && (
          <RevealSection>
            <section className="space-y-4">
              <SectionHeader title="Recent Posts" seeAllLink="/blog" />
              <p className="text-text-secondary text-sm md:text-base max-w-2xl leading-relaxed">
                Thoughts from recent builds, development experiments, and practical lessons learned while shipping creative software.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blogs.slice(0, 2).map((blog) => {
                  const coverSrc = blog.cover || blog.media?.[0]?.src;
                  return (
                    <Link
                      key={blog.slug}
                      to={`/blog/${blog.slug}`}
                      className="bg-surface rounded-xl p-4 hover:bg-surface-hover transition-colors group flex items-center gap-4 border border-transparent hover:border-border"
                    >
                      {coverSrc && (
                        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                          <img
                            src={coverSrc}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-text-primary group-hover:text-accent-blue transition-colors mb-1 line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-sm text-text-muted">
                          {new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </RevealSection>
        )}

        {/* ──────────── MORE ABOUT ME ──────────── */}
        <RevealSection>
          <section className="space-y-5">
            <SectionHeader title="More About Me" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Favorite Quotes — with authors */}
              <article className="extras-card space-y-3">
                <h3 className="text-sm uppercase tracking-wider text-text-muted flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M10 11H6a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 011 1v7c0 2.21-1.79 4-4 4" strokeLinecap="round" />
                    <path d="M20 11h-4a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 011 1v7c0 2.21-1.79 4-4 4" strokeLinecap="round" />
                  </svg>
                  Favorite Quotes
                </h3>
                <div className="space-y-3">
                  {(extras.favoriteQuotes || []).map((q, i) => {
                    const text = typeof q === 'string' ? q : q.text;
                    const author = typeof q === 'string' ? null : q.author;
                    return (
                      <div key={i} className="pl-3 border-l-2 border-border">
                        <p className="text-sm text-text-secondary italic leading-relaxed">"{text}"</p>
                        {author && (
                          <p className="text-xs text-text-muted mt-1">— {author}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </article>

              {/* Podcasts — with links */}
              <article className="extras-card space-y-3">
                <h3 className="text-sm uppercase tracking-wider text-text-muted flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path d="M19 10v2a7 7 0 01-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                  Podcasts I Listen To
                </h3>
                <ul className="space-y-2">
                  {(extras.podcasts || []).map((p, i) => {
                    const name = typeof p === 'string' ? p : p.name;
                    const url = typeof p === 'string' ? null : p.url;
                    return (
                      <li key={i}>
                        {url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors group"
                          >
                            <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-accent-blue transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 4h6v6" />
                              <path d="M10 14 20 4" />
                              <path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />
                            </svg>
                            {name}
                          </a>
                        ) : (
                          <span className="flex items-center gap-2 text-sm text-text-secondary">
                            <span className="w-1 h-1 rounded-full bg-text-muted flex-shrink-0" />
                            {name}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </article>

              {/* Interests — with emojis */}
              <article className="extras-card space-y-3">
                <h3 className="text-sm uppercase tracking-wider text-text-muted flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(extras.interests || []).map((item, i) => {
                    const label = typeof item === 'string' ? item : item.label;
                    const emoji = typeof item === 'string' ? null : item.emoji;
                    return (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1.5 rounded-md bg-bg border border-border text-text-secondary hover:text-text-primary hover:border-[#555] transition-colors flex items-center gap-1.5"
                      >
                        {emoji && <span>{emoji}</span>}
                        {label}
                      </span>
                    );
                  })}
                </div>
              </article>
            </div>
          </section>
        </RevealSection>

        {/* ──────────── MOBILE SOCIAL LINKS ──────────── */}
        <section className="lg:hidden pt-6 border-t border-border">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Connect</p>
          <ul className="space-y-1 mb-4">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <SocialLink href={link.url} hoverColor={link.hoverColor} glowColor={link.glowColor}>
                  {link.label}
                </SocialLink>
              </li>
            ))}
          </ul>
          {contact?.cv && (
            <a
              href={contact.cv}
              download
              className="flex font-semibold items-center gap-2 text-sm text-text-secondary hover:text-[#86EFAC] transition-all duration-300"
              onMouseEnter={(e) => e.currentTarget.style.textShadow = '0 0 8px #22c55e43, 0 0 16px rgba(34, 197, 94, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.textShadow = 'none'}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download CV</span>
            </a>
          )}
        </section>

      </div>
    </Layout>
  );
};

export default Home;
