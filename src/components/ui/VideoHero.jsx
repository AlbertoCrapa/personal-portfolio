import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PixelReveal from './PixelReveal';

/**
 * VideoHero
 * Full-viewport landing section with a blurred background reel video.
 *
 * Layout trick: the outer div uses `left: 50%; translateX(-50%); width: 100vw`
 * to break out of the Layout's max-w container, so it is always full-viewport-width.
 * Wrap this component in a `-mx-4 sm:-mx-6 lg:-mx-8 -mt-8 lg:-mt-10` div in the
 * parent page to cancel the Layout's horizontal padding and top padding.
 *
 * Props:
 *   reel    – { video: string, poster?: string }
 *   contact – { email?: string }
 *   hero    – { eyebrow?: string, description?: string }
 */
const VideoHero = ({ reel = {}, contact = {}, hero = {} }) => {
    const [scrollFade, setScrollFade] = React.useState(0);
    const [videoReady, setVideoReady] = React.useState(false);

    React.useEffect(() => {
        const onScroll = () => {
            setScrollFade(Math.min(1, window.scrollY / (window.innerHeight * 0.65)));
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div
            style={{
                position: 'relative',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100vw',
                height: 'calc(100svh - 56px)',
                overflow: 'hidden',
                background: 'var(--color-bg)',
            }}
        >
            {/* ── Video — only fades in once it's ready to play ── */}
            <motion.div
                initial={{ opacity: 0, filter: 'blur(24px)', scale: 1.12 }}
                animate={videoReady
                    ? { opacity: 1, filter: 'blur(4px)', scale: 1.08 }
                    : { opacity: 0, filter: 'blur(4px)', scale: 1.12 }}
                transition={{ duration: 1.6, ease: 'easeOut' }}
                style={{ position: 'absolute', inset: 0 }}
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={reel.poster}
                    onCanPlay={() => setVideoReady(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                >
                    {reel.video && <source src={reel.video} type="video/mp4" />}
                </video>
            </motion.div>

            {/* ── Persistent dark gradient (bottom-weighted) ── */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        'linear-gradient(to bottom, rgba(26,26,26,1) 0%, rgba(26,26,26,0.35) 55%, rgba(26,26,26,1) 100%)',
                    pointerEvents: 'none',
                }}
            />

            {/* ── Scroll-based fade-out overlay ── */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--color-bg)',
                    opacity: scrollFade,
                    pointerEvents: 'none',
                    willChange: 'opacity',
                }}
            />

            {/* ── Pixel shockwave — above video/gradients, below hero text ── */}
            <PixelReveal fullscreen={false} />

            {/* ── Hero content ── */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1.25rem',
                    textAlign: 'center',
                    padding: '2rem 1.5rem',
                }}
            >
                {/* Eyebrow label */}
                <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    style={{
                        fontSize: '0.68rem',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'var(--color-text-muted)',
                        fontWeight: 600,
                    }}
                >
                    {hero.eyebrow || 'Creative Developer'}
                </motion.p>

                {/* Name */}
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.18, duration: 0.65, ease: 'easeOut' }}
                    style={{
                        fontSize: 'clamp(2.8rem, 7vw, 7rem)',
                        fontWeight: 700,
                        letterSpacing: '-0.03em',
                        color: '#ffffff',
                        lineHeight: 1.0,
                        fontFamily: 'var(--font-family-display)',
                        margin: 0,
                    }}
                >
                    alberto crapanzano
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.35 }}
                    style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.9rem',
                        maxWidth: '28rem',
                        lineHeight: 1.65,
                        margin: 0,
                    }}
                >
                    {hero.description ||
                        'Frontend Engineer & Game Developer. I build things that balance technical craft and design.'}
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.35 }}
                    style={{
                        display: 'flex',
                        gap: '0.75rem',
                        marginTop: '0.25rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}
                >
                    <Link
                        to="/projects"
                        style={{
                            padding: '0.6rem 1.5rem',
                            background: '#ffffff',
                            color: '#1a1a1a',
                            borderRadius: '0.5rem',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            textDecoration: 'none',
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#d8d8d8'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; }}
                    >
                        View Projects
                    </Link>
                    <a
                        href={`mailto:${contact.email || 'hello@albyeah.com'}`}
                        style={{
                            padding: '0.6rem 1.5rem',
                            background: 'transparent',
                            color: '#ffffff',
                            borderRadius: '0.5rem',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            textDecoration: 'none',
                            border: '1px solid rgba(255,255,255,0.2)',
                            transition: 'border-color 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.55)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                    >
                        Get in Touch
                    </a>
                </motion.div>

                {/* Scroll indicator — fades out as soon as user starts scrolling */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.35rem',
                        opacity: Math.max(0, 1 - scrollFade * 5),
                        transition: 'opacity 0.15s',
                        pointerEvents: 'none',
                    }}
                >
                    <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'var(--color-text-muted)', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0' }}>
                        <span style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}>// </span>scroll_down
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        {['v', 'v', 'v'].map((v, i) => (
                            <motion.span
                                key={i}
                                animate={{ opacity: [0.15, 0.7, 0.15] }}
                                transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2, ease: 'easeInOut' }}
                                style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: 'var(--color-text-muted)', lineHeight: 1 }}
                            >{v}</motion.span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoHero;
