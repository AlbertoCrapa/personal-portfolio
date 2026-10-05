import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAnimate, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Download, Mail, Play } from 'lucide-react';

import SEO from '../../components/SEO';
import ProjectCard from '../../components/ui/ProjectCard';
import BlogCard from '../../components/ui/BlogCard';
import SectionHeader from '../../components/ui/SectionHeader';
import LinkButton from '../../components/ui/LinkButton';
import Tag from '../../components/ui/Tag';
import { Accordion } from '../../components/arc/accordion/accordion';
import { Badge } from '../../components/arc/badge/badge';
import { Input } from '../../components/arc/input/input';
import { Textarea } from '../../components/arc/textarea/textarea';
import { Button } from '../../components/arc/button/button';
import { Alert } from '../../components/arc/alert/alert';
import { radialDelays } from '../../components/ui/NavAnimations';
import { getProjectCover } from '../../utils/utils';
import projectData from '../../data/projects.json';
import playgroundData from '../../data/playground.json';
import blogData from '../../data/blog.json';
import data from '../../data/data.json';
import styles from './Home.module.css';

/**
 * Home — the landing page.
 *
 * Who it is for: studios hiring a technical designer or gameplay programmer,
 * and teams looking for a creative developer. What it has to prove, in order:
 * who this is (hero), what the work is (selected projects), that it is real
 * (a prototype that runs right here),
 * how deep it goes (writing), who the person is (about, then the quotes they
 * live by), and how to start a
 * conversation (contact, the page's one primary button).
 *
 * The shape follows Arc's own home: a centered statement over the product
 * shot, the work, live examples, then a closing call to action. The reel is
 * the one memorable detail. Section titles carry the site's muted slash.
 */

const projects = projectData.projects;
const findProject = (slug) => Object.values(projects).find((project) => project.slug === slug);

/* ── Hero ──────────────────────────────────────────────────────────────── */

const Reel = ({ reel, trailer }) => {
    const reduce = useReducedMotion();
    const videoRef = React.useRef(null);

    // Plays only while on screen; reduced motion keeps the poster still.
    React.useEffect(() => {
        const el = videoRef.current;
        if (!el || reduce || typeof IntersectionObserver === 'undefined') return undefined;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) el.play().catch(() => {});
            else el.pause();
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [reduce]);

    if (!reel.video && !reel.poster) return null;

    return (
        <figure className={styles.reel}>
            <div className={styles.reelFrame}>
                {reel.video && !reduce ? (
                    <video
                        ref={videoRef}
                        src={reel.video}
                        poster={reel.poster}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-label="Gameplay from Deadly Nightshade"
                    />
                ) : (
                    <img src={reel.poster} alt="Gameplay from Deadly Nightshade" />
                )}
            </div>
            <figcaption className={styles.reelCaption}>
                <span>Deadly Nightshade, the stealth action game I built as technical designer.</span>
                {trailer && (
                    <a href={trailer} target="_blank" rel="noopener noreferrer" className={styles.inlineLink}>
                        Watch the trailer
                        <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                    </a>
                )}
            </figcaption>
        </figure>
    );
};

/** The name with the top bar's hover sweep, on the same timing: letters dim
 *  one at a time outward from the pointer in a circle (radialDelays), across
 *  both lines when it wraps, and all fade back together on the way out.
 *
 *  It only reacts inside the x-height band of each line (baseline up to the
 *  top of an "o"), not the whole text box: a zero-width 1ex probe sitting on
 *  each word's baseline marks that band exactly, whatever the font size or
 *  wrapping. Screen readers get the name from the heading's label. */
const RippleName = ({ text }) => {
    const [scope, animate] = useAnimate();
    const inside = React.useRef(false);

    const chars = () => Array.from(scope.current?.querySelectorAll('[data-char]') || []);
    const inBand = ({ clientX: x, clientY: y }) => Array.from(scope.current?.querySelectorAll('[data-word]') || [])
        .some((word) => {
            const box = word.getBoundingClientRect();
            const band = word.firstElementChild.getBoundingClientRect();
            return x >= box.left && x <= box.right && y >= band.top && y <= band.bottom;
        });

    const enter = (event) => {
        const list = chars();
        const delays = radialDelays(list, event);
        list.forEach((el, i) => animate(el, { color: 'var(--text-muted)' }, { duration: 0.04, delay: delays[i] }));
    };
    const leave = () => {
        // Back at rest the colour is inherited again, so a theme switch applies.
        chars().forEach((el) => animate(el, { color: 'var(--foreground)' }, { duration: 0.15 }).then(() => { el.style.color = ''; }));
    };
    const track = (event) => {
        const now = event.type !== 'mouseleave' && inBand(event);
        if (now === inside.current) return;
        inside.current = now;
        if (now) enter(event); else leave();
    };

    return (
        <span ref={scope} aria-hidden="true" onMouseMove={track} onMouseLeave={track}>
            {text.split(' ').map((word, w) => (
                <React.Fragment key={w}>
                    {w > 0 && ' '}
                    <span className={styles.heroWord} data-word="">
                        <span className={styles.heroBand} />
                        {word.split('').map((char, i) => <span key={i} data-char="">{char}</span>)}
                    </span>
                </React.Fragment>
            ))}
        </span>
    );
};

const Hero = ({ hero, reel, trailer }) => (
    <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroText}>
            {/* Lowercase on purpose: the name as a wordmark, in the same voice
                as the top bar's lowercase links. */}
            <h1 id="home-title" className={styles.heroTitle} aria-label={hero.title || 'alberto crapanzano'}>
                <RippleName text={hero.title || 'alberto crapanzano'} />
            </h1>
            <p className={styles.heroDescription}>{hero.description}</p>
            <div className={styles.heroActions}>
                <LinkButton to={hero.ctaLink || '/projects'} variant="primary" size="lg">
                    {hero.ctaLabel || 'See my work'}
                    <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
                </LinkButton>
                <LinkButton href="#contact" variant="secondary" size="lg">
                    <Mail size={16} strokeWidth={1.75} aria-hidden="true" />
                    Get in touch
                </LinkButton>
            </div>
        </div>
        <Reel reel={reel} trailer={trailer} />
    </section>
);

/* ── Live prototype ────────────────────────────────────────────────────── */

const Prototype = ({ item }) => {
    if (!item) return null;
    const cover = getProjectCover(item);
    return (
        <section className={styles.section} aria-labelledby="home-live">
            <SectionHeader
                id="home-live"
                size="display"
                title="try it in your browser"
                description="Not a recording. This prototype runs live in your browser, compiled from C++."
                link={{ to: '/playground', label: 'See the playground' }}
            />
            <div className={styles.prototype}>
                {cover && (
                    <div className={styles.prototypeMedia}>
                        <img src={cover} alt="" loading="lazy" decoding="async" />
                    </div>
                )}
                <div className={styles.prototypeText}>
                    <h3 className={styles.prototypeTitle}>{item.title}</h3>
                    {item.experience?.instructions && (
                        <p className={styles.prototypeDescription}>{item.experience.instructions}</p>
                    )}
                    <div className={styles.prototypeActions}>
                        <LinkButton to={`/playground/${item.slug}/play`} variant="secondary">
                            <Play size={16} strokeWidth={1.75} aria-hidden="true" />
                            Start the prototype
                        </LinkButton>
                        <LinkButton to={`/playground/${item.slug}`} variant="ghost">
                            Read how it works
                        </LinkButton>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ── About ─────────────────────────────────────────────────────────────── */

const About = ({ about = {}, extras = {}, skills = [], spotify = {} }) => {
    const podcasts = (extras.podcasts || []).map((p) => (typeof p === 'string' ? { name: p } : p));
    const items = [
        (extras.interests || []).length > 0 && {
            title: 'What I’m into',
            content: (
                <ul className={styles.plainList}>
                    {extras.interests.map((interest) => <li key={interest.label}>{interest.label}</li>)}
                </ul>
            ),
        },
        skills.length > 0 && {
            title: 'Tools I reach for',
            content: (
                <ul className={styles.badges} aria-label="Tools">
                    {skills.map((skill) => <li key={skill}><Tag size="md">{skill}</Tag></li>)}
                </ul>
            ),
        },
        (podcasts.length > 0 || spotify.nowPlaying) && {
            title: 'In my ears',
            content: (
                <div className={styles.listen}>
                    {spotify.nowPlaying && (
                        <p>
                            <span className={styles.strong}>{spotify.nowPlaying}</span>
                            {spotify.artist && ` by ${spotify.artist}`}
                        </p>
                    )}
                    {podcasts.length > 0 && (
                        <ul className={styles.plainList}>
                            {podcasts.map((podcast) => (
                                <li key={podcast.name}>
                                    {podcast.url ? (
                                        <a href={podcast.url} target="_blank" rel="noopener noreferrer" className={styles.inlineLink}>
                                            {podcast.name}
                                            <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                                        </a>
                                    ) : podcast.name}
                                </li>
                            ))}
                        </ul>
                    )}
                    {(spotify.topArtists || []).length > 0 && (
                        <p className={styles.muted}>On repeat: {spotify.topArtists.join(', ')}</p>
                    )}
                </div>
            ),
        },
    ].filter(Boolean);

    return (
        <section className={styles.section} aria-labelledby="home-about">
            <SectionHeader id="home-about" size="display" title="about me" />
            <div className={styles.about}>
                <div className={styles.aboutText}>
                    {about.description && <p className={styles.aboutLead}>{about.description}</p>}
                    <div className={styles.aboutMeta}>
                        <Badge tone="success">Open to work</Badge>
                        {about.location && <span className={styles.muted}>{about.location}</span>}
                    </div>
                </div>
                {items.length > 0 && <Accordion items={items} defaultOpen={-1} />}
            </div>
        </section>
    );
};

/* ── Quotes ────────────────────────────────────────────────────────────── */

/**
 * One quote at a time on an Arc surface, stepped with the buttons. No
 * autoplay: text that moves on its own is hard to finish reading.
 */
const Quotes = ({ quotes = [] }) => {
    const [index, setIndex] = React.useState(0);
    if (!quotes.length) return null;
    const quote = quotes[index];
    const step = (by) => setIndex((i) => (i + by + quotes.length) % quotes.length);

    return (
        <section className={styles.section} aria-labelledby="home-quotes">
            <SectionHeader id="home-quotes" size="display" title="quotes" />
            <figure className={styles.quotePanel} aria-live="polite">
                <blockquote key={quote.text} className={styles.quoteText}>
                    &ldquo;{quote.text}&rdquo;
                </blockquote>
                <figcaption className={styles.quoteFooter}>
                    <span className={styles.quoteAuthor}>{quote.author}</span>
                    {quotes.length > 1 && (
                        <span className={styles.quoteNav}>
                            <span className={styles.muted}>{index + 1} / {quotes.length}</span>
                            <Button variant="secondary" size="sm" aria-label="Previous quote" onClick={() => step(-1)}>
                                <ChevronLeft size={16} strokeWidth={1.75} aria-hidden="true" />
                            </Button>
                            <Button variant="secondary" size="sm" aria-label="Next quote" onClick={() => step(1)}>
                                <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
                            </Button>
                        </span>
                    )}
                </figcaption>
            </figure>
        </section>
    );
};

/* ── Contact ───────────────────────────────────────────────────────────── */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (values) => {
    const errors = {};
    if (!values.email.trim()) errors.email = 'Enter your email so I can reply';
    else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Enter an email like name@studio.com';
    if (!values.subject.trim()) errors.subject = 'Add a subject, such as the role or the project';
    if (!values.message.trim()) errors.message = 'Write a few lines about what you have in mind';
    return errors;
};

/**
 * The form hands the message to the visitor's own mail app (nothing is sent
 * or stored by this site), so success says exactly that, in place.
 */
const ContactForm = ({ email }) => {
    const [values, setValues] = React.useState({ email: '', subject: '', message: '' });
    const [errors, setErrors] = React.useState({});
    const [submitted, setSubmitted] = React.useState(false);
    const [opened, setOpened] = React.useState(false);

    const update = (field) => (event) => {
        const next = { ...values, [field]: event.target.value };
        setValues(next);
        setOpened(false);
        if (submitted) setErrors(validate(next));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
        const found = validate(values);
        setErrors(found);
        if (Object.keys(found).length) return;
        const body = `From: ${values.email}\n\n${values.message}`;
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`;
        setOpened(true);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit} noValidate aria-label="Contact form">
            <div className={styles.formRow}>
                <Input label="Your email" name="email" type="email" autoComplete="email" placeholder="you@studio.com" value={values.email} onChange={update('email')} error={errors.email} />
                <Input label="Subject" name="subject" autoComplete="off" placeholder="Technical designer role" value={values.subject} onChange={update('subject')} error={errors.subject} />
            </div>
            <Textarea label="Message" name="message" rows={6} placeholder="Tell me about the team, the project or the role." value={values.message} onChange={update('message')} error={errors.message} />
            <Alert tone="success" title="Your mail app is open" open={opened}>
                The message is ready to send from there. Nothing is sent or stored by this site.
            </Alert>
            <div className={styles.formFooter}>
                <p className={styles.muted}>Opens your mail app with the message filled in.</p>
                <Button type="submit">Send message</Button>
            </div>
        </form>
    );
};

const Contact = ({ contact = {} }) => {
    const email = contact.email || 'hello@albyeah.com';
    const channels = [
        contact.linkedin && { label: 'LinkedIn', url: contact.linkedin },
        contact.github && { label: 'GitHub', url: contact.github },
        contact.itchio && { label: 'Itch.io', url: contact.itchio },
        contact.instagram && { label: 'Instagram', url: contact.instagram },
    ].filter(Boolean);

    return (
        <section id="contact" className={styles.section} aria-labelledby="home-contact">
            <SectionHeader
                id="home-contact"
                size="display"
                title="let’s build something"
                description="Hiring for a technical design or gameplay role, or need a creative developer? Tell me about it."
            />
            <div className={styles.contact}>
                <div className={styles.channels}>
                    <a href={`mailto:${email}`} className={styles.email}>
                        <Mail size={20} strokeWidth={1.75} aria-hidden="true" />
                        {email}
                    </a>
                    {channels.length > 0 && (
                        <ul className={styles.plainList}>
                            {channels.map((channel) => (
                                <li key={channel.label}>
                                    <a href={channel.url} target="_blank" rel="noopener noreferrer" className={styles.inlineLink}>
                                        {channel.label}
                                        <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                    {contact.cv && (
                        <div>
                            <LinkButton href={contact.cv} download variant="secondary">
                                <Download size={16} strokeWidth={1.75} aria-hidden="true" />
                                Download my CV
                            </LinkButton>
                        </div>
                    )}
                </div>
                <ContactForm email={email} />
            </div>
        </section>
    );
};

/* ── Page ──────────────────────────────────────────────────────────────── */

const Home = () => {
    const location = useLocation();
    const home = data.homepage || {};
    const featured = (home.featured || []).map(findProject).filter(Boolean);
    const prototype = (playgroundData.playground || []).find((item) => !item.hidden && item.experience);
    const posts = blogData.blogs || [];

    // `/#contact` (from the privacy page and the hero) lands on the form.
    React.useEffect(() => {
        if (!location.hash) return;
        const target = document.getElementById(location.hash.slice(1));
        if (target) target.scrollIntoView();
    }, [location.hash]);

    return (
        <>
            <SEO
                title="Alberto Crapanzano - Game Technical Designer & Creative Developer"
                description="Alberto Crapanzano (Albyeah) is a Creative Developer specializing in game Technical Design and Programming. Expert in Unity, Unreal Engine, and digital experiences."
                keywords="Alberto Crapanzano, Albyeah, Game Developer, Technical Designer, Creative Developer, Unity, Unreal Engine"
                url="/"
                isHomepage={true}
            />

            <div className={styles.page}>
                <Hero hero={home.hero || {}} reel={home.reel || {}} trailer={data.news?.buttonLink} />

                {featured.length > 0 && (
                    <section className={styles.section} aria-labelledby="home-work">
                        <SectionHeader
                            id="home-work"
                            size="display"
                            title="selected work"
                            description="Games and apps where I owned the systems, from enemy AI to the tools around it."
                            link={{ to: '/projects', label: 'See all projects' }}
                        />
                        <ul className={styles.cards}>
                            {featured.map((project) => (
                                <li key={project.slug}><ProjectCard project={project} /></li>
                            ))}
                        </ul>
                    </section>
                )}

                <Prototype item={prototype} />

                {posts.length > 0 && (
                    <section className={styles.section} aria-labelledby="home-writing">
                        <SectionHeader
                            id="home-writing"
                            size="display"
                            title="writing"
                            description="Deep dives into how the systems were built, and what I would change."
                            link={{ to: '/blog', label: 'Read the blog' }}
                        />
                        <ul className={styles.rows}>
                            {posts.slice(0, 3).map((post) => (
                                <li key={post.slug}><BlogCard blog={post} size="list" /></li>
                            ))}
                        </ul>
                    </section>
                )}

                <About about={data.about} extras={home.extras} skills={home.skills} spotify={home.spotify} />

                <Quotes quotes={home.extras?.favoriteQuotes} />

                <Contact contact={data.contact} />
            </div>
        </>
    );
};

export default Home;
