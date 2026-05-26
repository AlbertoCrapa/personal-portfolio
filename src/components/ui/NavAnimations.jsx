import React from 'react';
import { useAnimate } from 'framer-motion';

// ── Constants ─────────────────────────────────────────────────────────────
const SCRAMBLE_CHARS = 'abcdefghijklmnopqrstuvwxyz#@!?$%';
export const NAV_SHORT_NAME = 'albyeah';
export const NAV_FULL_NAME = 'alberto crapanzano';
const SCROLL_THRESHOLD = 500;

// ── Helpers ───────────────────────────────────────────────────────────────
const randGray = () => {
    const v = Math.floor(Math.random() * 60) + 150; // 150–209
    return `rgb(${v},${v},${v})`;
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
// Nav-link label that sweeps white from the cursor position outward on hover.
// Props:
//   label  – string to display
//   active – whether this link is the current route
export const ShimmerNavLabel = ({ label, active }) => {
    const [scope, animate] = useAnimate();

    const handleMouseEnter = (e) => {
        const container = scope.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const charWidth = rect.width / label.length;
        const startIndex = Math.max(0, Math.min(label.length - 1, Math.floor(mouseX / charWidth)));
        Array.from(container.children).forEach((el, i) => {
            animate(el, { color: '#ffffff' }, { duration: 0.04, delay: Math.abs(i - startIndex) * 0.03 });
        });
    };

    const handleMouseLeave = () => {
        const container = scope.current;
        if (!container) return;
        const resetColor = active ? '#ffffff' : '#a0a0a0';
        Array.from(container.children).forEach((el) => {
            animate(el, { color: resetColor }, { duration: 0.15 });
        });
    };

    return (
        <span ref={scope} className="flex" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {label.split('').map((char, i) => (
                <span key={i} style={{ color: active ? '#ffffff' : '#a0a0a0' }}>{char}</span>
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
    activeColor = '#ffffff',
    hoverColor = '#c0c0c0',
    inactiveColor = '#6b6b6b',
}) => {
    const [scope, animate] = useAnimate();
    const prevActiveRef = React.useRef(active);

    React.useEffect(() => {
        const container = scope.current;
        if (!container) return;
        const chars = Array.from(container.children);

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
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const charWidth = rect.width / (text.length || 1);
        const startIndex = Math.max(0, Math.min(text.length - 1, Math.floor(mouseX / charWidth)));
        Array.from(container.children).forEach((el, i) =>
            animate(el, { color: hoverColor }, { duration: 0.04, delay: Math.abs(i - startIndex) * 0.03 }),
        );
    };

    const handleMouseLeave = () => {
        const container = scope.current;
        if (!container) return;
        const resetColor = active ? activeColor : inactiveColor;
        Array.from(container.children).forEach((el) =>
            animate(el, { color: resetColor }, { duration: 0.15 }),
        );
    };

    return (
        <span
            ref={scope}
            className="inline-flex flex-wrap"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {text.split('').map((char, i) => (
                <span key={i} style={{ color: active ? activeColor : inactiveColor }}>
                    {char === ' ' ? '\u00a0' : char}
                </span>
            ))}
        </span>
    );
};

// ── LogoName ───────────────────────────────────────────────────────────────
// Logo text that:
//   • scrambles with random light-gray characters when `text` changes
//   • dims letter-by-letter from the cursor on hover (same stagger as ShimmerNavLabel)
// Props:
//   text – the resolved name string (from useNavName)
export const LogoName = ({ text }) => {
    const [scope, animate] = useAnimate();
    const [display, setDisplay] = React.useState(() =>
        text.split('').map(c => ({ char: c === ' ' ? '\u00A0' : c, color: '#ffffff' }))
    );
    const prevRef = React.useRef(text);

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
                        if (text[i] === ' ') return { char: '\u00A0', color: '#ffffff' };
                        if (i < revealed) return { char: text[i], color: '#ffffff' };
                        return {
                            char: SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
                            color: randGray(),
                        };
                    })
                );
                await new Promise(r => setTimeout(r, stepMs));
            }
            if (!cancelled)
                setDisplay(text.split('').map(c => ({ char: c === ' ' ? '\u00A0' : c, color: '#ffffff' })));
        })();
        return () => { cancelled = true; };
    }, [text]);

    // Hover: dims to menu-item gray from cursor outward
    const handleMouseEnter = (e) => {
        const container = scope.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const count = container.children.length;
        const charWidth = rect.width / count;
        const startIndex = Math.max(0, Math.min(count - 1, Math.floor(mouseX / charWidth)));
        Array.from(container.children).forEach((el, i) => {
            animate(el, { color: '#a0a0a0' }, { duration: 0.04, delay: Math.abs(i - startIndex) * 0.03 });
        });
    };

    const handleMouseLeave = () => {
        const container = scope.current;
        if (!container) return;
        Array.from(container.children).forEach((el) => {
            animate(el, { color: '#ffffff' }, { duration: 0.15 });
        });
    };

    return (
        <span ref={scope} style={{ display: 'inline-flex' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {display.map((d, i) => (
                <span key={i} style={{ color: d.color }}>{d.char}</span>
            ))}
        </span>
    );
};
