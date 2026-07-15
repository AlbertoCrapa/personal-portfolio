import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import VideoPlayer from './VideoPlayer';

/**
 * MediaFrame
 *
 * Wraps a single content image or video and adds a bottom-right button that
 * expands it to a smooth, rounded fullscreen overlay.
 *
 * The media element is rendered exactly once (a "reverse portal"): it lives in
 * a detached host node that we physically relocate between the inline slot and
 * the fullscreen stage. Because it is the *same* element, a playing video keeps
 * running with its own controls and nothing reloads.
 *
 * The open/close motion animates the stage's box (top/left/width/height), not a
 * transform:scale. That way the media image scales, but the absolutely-
 * positioned chrome (the play/pause pill, the rounded corners) keeps its fixed
 * pixel size and simply rides to the new corner: since a control's start and
 * end size are identical, it never appears to resize mid-flight.
 *
 * The overlay is portaled to <body> because the reading column sits inside a
 * transformed ancestor (.homepage-reveal keeps `transform: translateY(0)`),
 * which would otherwise capture `position: fixed`.
 *
 * Banners/covers never use this component, so they stay button-free. Pass
 * `allowFullscreen={false}` (from a media item's `nonFullscreen: true`) to hide
 * the button for a specific image. The button only appears once the media has
 * fully loaded.
 *
 * Props:
 *   src, isVideo, poster, alt, description, allowFullscreen (default true)
 */

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const OPEN_MS = 480;
const CLOSE_MS = 380;

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Centered, aspect-preserving box that fits within the viewport (module-level
// so the animation callbacks stay stable).
const computeTargetRect = (aspect) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const ratio = aspect || 16 / 9;
    const maxW = vw * 0.92;
    const maxH = vh * 0.86;
    let w = maxW;
    let h = w / ratio;
    if (h > maxH) { h = maxH; w = h * ratio; }
    return { top: (vh - h) / 2, left: (vw - w) / 2, width: w, height: h };
};

const applyRect = (el, r, durMs) => {
    el.style.transition = durMs
        ? `top ${durMs}ms ${EASE}, left ${durMs}ms ${EASE}, width ${durMs}ms ${EASE}, height ${durMs}ms ${EASE}`
        : 'none';
    el.style.top = `${r.top}px`;
    el.style.left = `${r.left}px`;
    el.style.width = `${r.width}px`;
    el.style.height = `${r.height}px`;
};

const rectOf = (el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top, left: r.left, width: r.width, height: r.height };
};

const MediaFrame = ({
    src,
    isVideo = false,
    poster,
    alt = '',
    description = '',
    allowFullscreen = true,
}) => {
    const inlineTargetRef = useRef(null);
    const stageRef = useRef(null);
    const closingTimer = useRef(null);
    const scrollLockY = useRef(0);
    const centeredScrollY = useRef(null);
    const centerTimer = useRef(null);
    const aspectRef = useRef(isVideo ? 16 / 9 : null);

    // The single, reusable media host that we move between inline and fullscreen.
    const hostRef = useRef(null);
    if (hostRef.current === null && typeof document !== 'undefined') {
        const el = document.createElement('div');
        el.style.display = 'contents'; // layout-transparent: children fill the target
        hostRef.current = el;
    }

    const [mounted, setMounted] = useState(false); // overlay present
    const [show, setShow] = useState(false); // expanded (backdrop/caption in)
    const [loaded, setLoaded] = useState(false); // media ready -> button appears

    const handleImageLoad = (e) => {
        const { naturalWidth: w, naturalHeight: h } = e.target;
        if (w && h) aspectRef.current = w / h;
        setLoaded(true);
    };

    // Relocate the media host to the correct target whenever fullscreen toggles,
    // then (when opening) run the box morph. Runs before paint = no flicker.
    useLayoutEffect(() => {
        const host = hostRef.current;
        if (!host) return;

        if (mounted) {
            const stage = stageRef.current;
            if (stage && host.parentNode !== stage) stage.appendChild(host);
            if (!stage) { setShow(true); return; }

            const from = inlineTargetRef.current && rectOf(inlineTargetRef.current);
            const to = computeTargetRect(aspectRef.current);

            if (!from || prefersReducedMotion()) {
                applyRect(stage, to, null);
                setShow(true);
                return;
            }
            applyRect(stage, from, null); // start collapsed on the inline box
            // force reflow so the start box commits before animating
            // eslint-disable-next-line no-unused-expressions
            stage.getBoundingClientRect();
            requestAnimationFrame(() => {
                applyRect(stage, to, OPEN_MS);
                setShow(true);
            });
        } else {
            const inline = inlineTargetRef.current;
            if (inline && host.parentNode !== inline) inline.appendChild(host);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted]);

    // Lock scroll while open. Uses position:fixed on <body> (not overflow) so we
    // can secretly re-center the frozen page, and relies on the app's
    // `scrollbar-gutter: stable` (index.css) to avoid any horizontal shift when
    // the scrollbar toggles: no manual padding compensation.
    useEffect(() => {
        if (!mounted) return;
        const { body, documentElement: html } = document;
        const y = window.scrollY;
        scrollLockY.current = y;

        const prev = {
            position: body.style.position,
            top: body.style.top,
            left: body.style.left,
            right: body.style.right,
            width: body.style.width,
        };
        body.style.position = 'fixed';
        body.style.top = `-${y}px`;
        body.style.left = '0';
        body.style.right = '0';
        body.style.width = '100%';

        // Once the backdrop has covered the page, scroll the frozen document so
        // the media's inline slot is centered -> the close morph collapses to the
        // middle of the screen. Hidden behind the opaque, blurred backdrop.
        const centered = centeredScrollY.current;
        if (centered != null && Math.abs(centered - y) > 1) {
            centerTimer.current = setTimeout(() => {
                body.style.top = `-${centered}px`;
                scrollLockY.current = centered;
            }, OPEN_MS + 20);
        }

        return () => {
            if (centerTimer.current) { clearTimeout(centerTimer.current); centerTimer.current = null; }
            body.style.position = prev.position;
            body.style.top = prev.top;
            body.style.left = prev.left;
            body.style.right = prev.right;
            body.style.width = prev.width;
            const prevBehavior = html.style.scrollBehavior;
            html.style.scrollBehavior = 'auto'; // beat `scroll-behavior: smooth`
            window.scrollTo(0, scrollLockY.current);
            html.style.scrollBehavior = prevBehavior;
        };
    }, [mounted]);

    const openFullscreen = () => {
        if (closingTimer.current) {
            clearTimeout(closingTimer.current);
            closingTimer.current = null;
        }
        const inline = inlineTargetRef.current;
        if (inline) {
            // Scroll position that would center this slot (computed before the
            // lock changes document height); used for the secret re-center.
            const rect = inline.getBoundingClientRect();
            const y = window.scrollY;
            const vh = window.innerHeight;
            const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);
            const docTop = rect.top + y;
            centeredScrollY.current = Math.max(0, Math.min(docTop + rect.height / 2 - vh / 2, maxScroll));
            // Freeze the inline slot's height so the article doesn't collapse
            // while the media is detached (and so the close morph lands right).
            inline.style.height = `${inline.offsetHeight}px`;
        }
        setShow(false);
        setMounted(true);
    };

    const closeFullscreen = useCallback(() => {
        const stage = stageRef.current;

        const finish = () => {
            const inline = inlineTargetRef.current;
            if (inline) inline.style.height = '';
            setMounted(false);
        };

        const inline = inlineTargetRef.current;
        if (!stage || !inline || prefersReducedMotion()) {
            setShow(false);
            finish();
            return;
        }

        applyRect(stage, rectOf(inline), CLOSE_MS); // collapse back onto the slot
        setShow(false);
        closingTimer.current = setTimeout(finish, CLOSE_MS);
    }, []);

    // ESC to close.
    useEffect(() => {
        if (!mounted) return;
        const onKey = (e) => { if (e.key === 'Escape') closeFullscreen(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [mounted, closeFullscreen]);

    useEffect(() => () => {
        if (closingTimer.current) clearTimeout(closingTimer.current);
    }, []);

    // The media element itself, rendered once into the movable host.
    const mediaElement = isVideo ? (
        <VideoPlayer src={src} poster={poster} onReady={() => setLoaded(true)} className="w-full" />
    ) : (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
            onError={(e) => { e.target.src = 'https://placehold.co/800x600'; setLoaded(true); }}
            className="w-full h-auto block"
        />
    );

    const showButton = allowFullscreen && loaded && !mounted;

    return (
        <figure className="space-y-1">
            <div className="relative group">
                {/* Inline slot: the media host lives here when not fullscreen */}
                <div ref={inlineTargetRef} className="w-full rounded-xl overflow-hidden" />

                {showButton && (
                    /* Matches VideoPlayer's play/pause pill: same height, padding,
                       radius and background (identical on mobile). */
                    <button
                        type="button"
                        onClick={openFullscreen}
                        className="absolute bottom-3 right-3 z-20 flex items-center justify-center bg-bg/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-text-primary hover:bg-surface transition-colors"
                        aria-label="View fullscreen"
                        title="View fullscreen"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                            <path
                                d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3m13 5h3a2 2 0 0 0 2-2v-3"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                )}
            </div>

            {description && (
                <figcaption className="text-sm text-text-muted text-center">
                    {description}
                </figcaption>
            )}

            {/* The single media instance. createPortal targets our stable host node,
                so moving the host between slots never remounts it. */}
            {hostRef.current && createPortal(mediaElement, hostRef.current)}

            {/* Fullscreen overlay */}
            {mounted && createPortal(
                <div
                    className="fixed inset-0 z-[200]"
                    role="dialog"
                    aria-modal="true"
                    aria-label={description || alt || 'Fullscreen media'}
                >
                    <div
                        onClick={closeFullscreen}
                        className="absolute inset-0 bg-bg/85 backdrop-blur-md"
                        style={{ opacity: show ? 1 : 0, transition: `opacity ${show ? OPEN_MS : CLOSE_MS}ms ${EASE}` }}
                    />

                    <button
                        type="button"
                        onClick={closeFullscreen}
                        className="absolute top-4 right-4 z-30 flex items-center justify-center bg-bg/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-text-primary hover:bg-surface transition-colors"
                        style={{ opacity: show ? 1 : 0, transition: `opacity ${show ? OPEN_MS : CLOSE_MS}ms ${EASE}, background-color 200ms ease` }}
                        aria-label="Close fullscreen"
                        title="Close (Esc)"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>

                    {/* Stage: the media host is relocated here; its box is animated. */}
                    <div
                        ref={stageRef}
                        style={{ position: 'fixed', top: 0, left: 0, width: 0, height: 0, willChange: 'top, left, width, height' }}
                        className="z-10 rounded-xl overflow-hidden shadow-2xl bg-surface"
                    />

                    {description && (
                        // Full-width bar on mobile (as wide as the screen); a
                        // centered pill on larger screens.
                        <div className="absolute inset-x-0 bottom-4 sm:bottom-6 z-30 flex justify-center px-3 sm:px-4 pointer-events-none">
                            <figcaption
                                className="w-full sm:w-auto sm:max-w-[80vw] px-4 py-2 rounded-2xl sm:rounded-full bg-bg/80 backdrop-blur-sm text-sm text-text-secondary text-center"
                                style={{ opacity: show ? 1 : 0, transition: `opacity ${show ? OPEN_MS : CLOSE_MS}ms ${EASE}` }}
                            >
                                {description}
                            </figcaption>
                        </div>
                    )}
                </div>,
                document.body
            )}
        </figure>
    );
};

export default MediaFrame;
