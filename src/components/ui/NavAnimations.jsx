import React from 'react';
import { useAnimate } from 'framer-motion';

import { useTheme } from './ThemeProvider';

// ── Constants ─────────────────────────────────────────────────────────────
const SCRAMBLE_CHARS = 'abcdefghijklmnopqrstuvwxyz#@!?$%';
export const NAV_SHORT_NAME = 'albyeah';
export const NAV_FULL_NAME = 'alberto crapanzano';
const SCROLL_THRESHOLD = 500;

// ── Helpers ───────────────────────────────────────────────────────────────
// Scramble glyphs sit a little off the final colour so the reveal is visible.
// On a light canvas that means darker than the text, not lighter.
const randGray = (isDark = true) => {
    const v = isDark
        ? Math.floor(Math.random() * 60) + 150 // 150–209 on near-black
        : Math.floor(Math.random() * 60) + 110; // 110–169 on near-white
    return `rgb(${v},${v},${v})`;
};

// Palette tokens rather than hex, so the nav follows the theme without any of
// its timing or layout changing.
const TEXT_PRIMARY = 'var(--color-text-primary)';
const TEXT_SECONDARY = 'var(--color-text-secondary)';
const TEXT_MUTED = 'var(--color-text-muted)';

// ── radialDelays ───────────────────────────────────────────────────────────
// Per-character delays for the hover sweep, from each glyph's on-screen
// distance to the pointer. Measured live, so a label that wraps onto two lines
// ripples out in a circle across both, and a reflow (narrower window, other
// font) changes the ripple with it. One step per average glyph width keeps a
// single line timed exactly as the old index-based sweep.
const SWEEP_STEP = 0.03; // seconds per glyph width
export const radialDelays = (chars, event) => {
    const boxes = chars.map((el) => el.getBoundingClientRect());
    const unit = boxes.reduce((sum, box) => sum + box.width, 0) / (boxes.length || 1) || 1;
    const distances = boxes.map((box) => Math.hypot(
        box.left + box.width / 2 - event.clientX,
        box.top + box.height / 2 - event.clientY,
    ));
    const nearest = Math.min(...distances);
    return distances.map((d) => ((d - nearest) / unit) * SWEEP_STEP);
};

// ── useNavName ─────────────────────────────────────────────────────────────
// Returns NAV_SHORT_NAME on the home page while at the top,
// NAV_FULL_NAME on any other page or when scrolled past SCROLL_THRESHOLD.
export const useNavName = (pathname) => {
    const isHome = pathname === '/';
    const [scrolled, setScrolled] = React.useState(() => window.scrollY > SCROLL_THRESHOLD);

    React.useEffect(() => {
        setScrolled(window.scrollY > SCROLL_THRESHOLD);
        if (!isHome) return;
        const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [isHome]);

    return isHome && !scrolled ? NAV_SHORT_NAME : NAV_FULL_NAME;
};

// ── ShimmerNavLabel ────────────────────────────────────────────────────────
// Nav-link label that sweeps white from the cursor position outward on hover
// (radially, see radialDelays).
// Props:
//   label  – string to display
//   active – whether this link is the current route
export const ShimmerNavLabel = ({ label, active }) => {
    const [scope, animate] = useAnimate();
    const { theme } = useTheme();

    // A character animated by the sweep keeps the literal colour Motion
    // resolved for it, so a theme swap has to hand the rest state back.
    React.useEffect(() => {
        const container = scope.current;
        if (!container) return;
        const resetColor = active ? TEXT_PRIMARY : TEXT_SECONDARY;
        Array.from(container.children).forEach((el) => { el.style.color = resetColor; });
    }, [theme, active, scope]);

    const handleMouseEnter = (e) => {
        const container = scope.current;
        if (!container) return;
        const chars = Array.from(container.children);
        const delays = radialDelays(chars, e);
        chars.forEach((el, i) => {
            animate(el, { color: TEXT_PRIMARY }, { duration: 0.04, delay: delays[i] });
        });
    };

    const handleMouseLeave = () => {
        const container = scope.current;
        if (!container) return;
        const resetColor = active ? TEXT_PRIMARY : TEXT_SECONDARY;
        Array.from(container.children).forEach((el) => {
            animate(el, { color: resetColor }, { duration: 0.15 });
        });
    };

    return (
        <span ref={scope} className="flex" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {label.split('').map((char, i) => (
                <span key={i} style={{ color: active ? TEXT_PRIMARY : TEXT_SECONDARY }}>{char}</span>
            ))}
        </span>
    );
};

// ── ShimmerText ─────────────────────────────────────────────────────────────
// Reusable per-character shimmer sweep for any active/inactive state.
//   active → true  : sweep activeColor left-to-right (staggered)
//   active → false : fade all chars to inactiveColor
//   hover          : sweep activeColor from cursor position outward, then restore
export const ShimmerText = ({
    text,
    active,
    activeColor = TEXT_PRIMARY,
    hoverColor = TEXT_SECONDARY,
    inactiveColor = TEXT_MUTED,
}) => {
    const [scope, animate] = useAnimate();
    const { theme } = useTheme();
    const prevActiveRef = React.useRef(active);

    React.useEffect(() => {
        const container = scope.current;
        if (!container) return;
        const resetColor = active ? activeColor : inactiveColor;
        shimmerChars(container).forEach((el) => { el.style.color = resetColor; });
    }, [theme, active, activeColor, inactiveColor, scope]);

    React.useEffect(() => {
        const container = scope.current;
        if (!container) return;
        const chars = shimmerChars(container);

        if (active && !prevActiveRef.current) {
            // Became active — sweep left → right
            chars.forEach((el, i) =>
                animate(el, { color: activeColor }, { duration: 0.04, delay: i * 0.025 }),
            );
        } else if (!active && prevActiveRef.current) {
            // Became inactive — fade out
            chars.forEach((el) =>
                animate(el, { color: inactiveColor }, { duration: 0.2 }),
            );
        }
        prevActiveRef.current = active;
    }, [active, activeColor, inactiveColor, animate, scope]);

    const handleMouseEnter = (e) => {
        const container = scope.current;
        if (!container) return;
        const chars = shimmerChars(container);
        const delays = radialDelays(chars, e);
        chars.forEach((el, i) =>
            animate(el, { color: hoverColor }, { duration: 0.04, delay: delays[i] }),
        );
    };

    const handleMouseLeave = () => {
        const container = scope.current;
        if (!container) return;
        const resetColor = active ? activeColor : inactiveColor;
        shimmerChars(container).forEach((el) =>
            animate(el, { color: resetColor }, { duration: 0.15 }),
        );
    };

    // Characters are grouped per word so a long label wraps between words
    // instead of mid-word: a flat list of one-character flex items has no idea
    // where the words are. The animation still targets the characters.
    let charIndex = 0;

    return (
        <span
            ref={scope}
            className="inline-flex flex-wrap"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {text.split(/(\s+)/).filter(Boolean).map((word, w) => (
                <span key={w} className="inline-flex whitespace-nowrap">
                    {word.split('').map((char, i) => (
                        <span
                            key={i}
                            data-shimmer-char={charIndex++}
                            style={{ color: active ? activeColor : inactiveColor }}
                        >
                            {char === ' ' ? '\u00a0' : char}
                        </span>
                    ))}
                </span>
            ))}
        </span>
    );
};

/** Flat, in-order list of the character spans inside a ShimmerText. */
const shimmerChars = (container) =>
    Array.from(container.querySelectorAll('[data-shimmer-char]'));

// ── LogoName ───────────────────────────────────────────────────────────────
// Logo text that:
//   • scrambles with random light-gray characters when `text` changes
//   • dims letter-by-letter from the cursor on hover (same stagger as ShimmerNavLabel)
// Props:
//   text – the resolved name string (from useNavName)
export const LogoName = ({ text }) => {
    const [scope, animate] = useAnimate();
    const { theme } = useTheme();
    const isDark = theme !== 'light';
    const [display, setDisplay] = React.useState(() =>
        text.split('').map(c => ({ char: c === ' ' ? '\u00A0' : c, color: TEXT_PRIMARY }))
    );
    const prevRef = React.useRef(text);

    React.useEffect(() => {
        const container = scope.current;
        if (!container) return;
        Array.from(container.children).forEach((el) => { el.style.color = TEXT_PRIMARY; });
    }, [theme, scope]);

    // Scramble on text change
    React.useEffect(() => {
        if (prevRef.current === text) return;
        prevRef.current = text;
        let cancelled = false;
        const steps = 14;
        const stepMs = 28;
        (async () => {
            for (let step = 0; step <= steps; step++) {
                if (cancelled) return;
                const revealed = Math.floor((step / steps) * text.length);
                setDisplay(
                    Array.from({ length: text.length }, (_, i) => {
                        if (text[i] === ' ') return { char: '\u00A0', color: TEXT_PRIMARY };
                        if (i < revealed) return { char: text[i], color: TEXT_PRIMARY };
                        return {
                            char: SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
                            color: randGray(isDark),
                        };
                    })
                );
                await new Promise(r => setTimeout(r, stepMs));
            }
            if (!cancelled)
                setDisplay(text.split('').map(c => ({ char: c === ' ' ? '\u00A0' : c, color: TEXT_PRIMARY })));
        })();
        return () => { cancelled = true; };
    }, [text, isDark]);

    // Hover: dims to menu-item gray from cursor outward
    const handleMouseEnter = (e) => {
        const container = scope.current;
        if (!container) return;
        const chars = Array.from(container.children);
        const delays = radialDelays(chars, e);
        chars.forEach((el, i) => {
            animate(el, { color: TEXT_SECONDARY }, { duration: 0.04, delay: delays[i] });
        });
    };

    const handleMouseLeave = () => {
        const container = scope.current;
        if (!container) return;
        Array.from(container.children).forEach((el) => {
            animate(el, { color: TEXT_PRIMARY }, { duration: 0.15 });
        });
    };

    // Each slot reserves the width of its *final* character, so the random
    // scramble glyphs (which have different advance widths) never reflow the bar.
    const slots = text.split('').map((c) => (c === ' ' ? '\u00A0' : c));

    return (
        <span ref={scope} style={{ display: 'inline-flex' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {slots.map((finalChar, i) => {
                const d = display[i];
                return (
                    <span
                        key={i}
                        style={{ position: 'relative', display: 'inline-block', color: d ? d.color : TEXT_PRIMARY }}
                    >
                        <span aria-hidden="true" style={{ visibility: 'hidden' }}>{finalChar}</span>
                        <span style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}>
                            {d ? d.char : finalChar}
                        </span>
                    </span>
                );
            })}
        </span>
    );
};
