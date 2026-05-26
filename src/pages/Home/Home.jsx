import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import SectionHeader from '../../components/ui/SectionHeader';
import ProjectCard from '../../components/ui/ProjectCard';
import Button from '../../components/ui/Button';
import SocialLink from '../../components/ui/SocialLink';
import VideoPlayer from '../../components/ui/VideoPlayer';
import TravelMapCard from '../../components/ui/TravelMapCard';
import VideoHero from '../../components/ui/VideoHero';
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
   Spotify curiosity mini-card (used in More About Me)
   ───────────────────────────────────────────────────── */

const SpotifyMiniCard = ({ spotify = {} }) => (
  <article className="extras-card space-y-3">
    <h3 className="text-sm uppercase tracking-wider text-text-muted flex items-center gap-2">
      <svg className="w-4 h-4 text-spotify" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
      Currently listening
    </h3>
    {spotify.nowPlaying && (
      <div>
        <p className="text-sm font-semibold text-text-primary">{spotify.nowPlaying}</p>
        <p className="text-xs text-text-secondary mt-0.5">{spotify.artist}{spotify.album ? ` · ${spotify.album}` : ''}</p>
      </div>
    )}
    {spotify.topArtists?.length > 0 && (
      <div className="space-y-1.5">
        <p className="text-xs text-text-muted">Top artists</p>
        <div className="flex flex-wrap gap-1.5">
          {spotify.topArtists.map((a) => (
            <span key={a} className="text-xs px-2 py-0.5 rounded-full border border-spotify-border text-spotify-dim bg-spotify-bg">{a}</span>
          ))}
        </div>
      </div>
    )}
    {spotify.genres?.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {spotify.genres.map((g) => (
          <span key={g} className="text-[10px] uppercase tracking-wider text-text-muted px-2 py-0.5 bg-bg rounded">{g}</span>
        ))}
      </div>
    )}
  </article>
);

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
  const spotlightStats = [
    { label: 'Role focus', value: 'Creative Developer' },
    { label: 'Core stack', value: 'React, Unreal, Unity' },
    { label: 'Availability', value: 'Open to interviews' },
    { label: 'Based in', value: 'Milan, IT' },
  ];

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
                      className="relative rounded-xl bg-surface border border-border hover:border-[#4a4a4a] transition-colors group flex items-center gap-4 p-4 h-full"
                    >
                      {coverSrc && (
                        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                          <img
                            src={coverSrc}
                            alt={`${blog.title} cover`}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                            onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base text-text-primary leading-tight group-hover:text-accent-blue transition-colors mb-1 line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-xs uppercase tracking-wide text-text-muted">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

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

              <TravelMapCard />
              <SpotifyMiniCard spotify={spotify} />
            </div>
          </section>
        </RevealSection>

        {/* ──────────── CONTACT ──────────── */}
        <RevealSection>
          <section id="contact" className="pt-6 border-t border-border space-y-6">
            <SectionHeader title="Let's talk" />
            <p className="text-text-secondary leading-relaxed max-w-2xl">
              {data.about?.description2 || "Interested in working together? Drop me a message."}
            </p>
            <div className="bg-surface rounded-xl p-6 lg:p-8 max-w-xl">
              <ContactForm email={contact?.email} />
            </div>
            <div className="flex flex-wrap gap-3">
              {contact?.cv && (
                <Button href={contact.cv} download variant="secondary" size="md">
                  Download CV
                </Button>
              )}
              {contact?.github && (
                <Button href={contact.github} variant="secondary" size="md">GitHub</Button>
              )}
              {contact?.linkedin && (
                <Button href={contact.linkedin} variant="secondary" size="md">LinkedIn</Button>
              )}
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition-colors"
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
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition-colors"
        />
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
          rows={5}
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition-colors resize-none"
        />
      </div>
      <Button type="submit" variant="primary" size="md">
        Send Message
      </Button>
    </form>
  );
};

export default Home;
