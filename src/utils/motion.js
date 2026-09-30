import { useEffect, useState } from "react";

/**
 * Motion design tokens.
 *
 * The whole site animates from this one file so every spring in the UI belongs
 * to the same physical world: a card lifting, a chip popping in and a filter
 * grid reflowing all read as the same material.
 *
 * Numbers follow the beUI motion set (beui.dev/components/motion) because the
 * site already leaned on that grammar — layoutId indicators, press feedback,
 * popLayout chips — just implemented ad hoc in each component.
 */

// ── Springs ───────────────────────────────────────────────────────────────
/** Layout reflow: grids re-sorting, panels resizing, indicators gliding. */
export const SPRING_LAYOUT = {
  type: "spring",
  stiffness: 360,
  damping: 32,
  mass: 0.6,
};

/** Content swapping in place: chips, counters, label cross-fades. */
export const SPRING_SWAP = {
  type: "spring",
  stiffness: 460,
  damping: 30,
  mass: 0.55,
};

/** Pointer-down feedback. Fast, barely any overshoot. */
export const SPRING_PRESS = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.6,
};

/** Cursor-tracked values (tilt, magnetic pull). Loose and trailing. */
export const SPRING_MOUSE = { stiffness: 200, damping: 15, mass: 0.3 };

/** The "bouncy" family — duration+bounce notation, used by the accordion. */
export const SPRING_BOUNCE_ROW = { type: "spring", duration: 0.55, bounce: 0.38 };
export const SPRING_BOUNCE_OPEN = { type: "spring", duration: 0.58, bounce: 0.32 };
export const SPRING_BOUNCE_CLOSE = { type: "spring", duration: 0.46, bounce: 0.26 };
export const SPRING_BOUNCE_ICON = { type: "spring", duration: 0.42, bounce: 0.28 };

/** Surface morph — a panel growing out of the control that opened it. */
export const SPRING_SURFACE = { type: "spring", duration: 0.42, bounce: 0.22 };

// ── Easings ───────────────────────────────────────────────────────────────
export const EASE_OUT = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT = [0.77, 0, 0.175, 1];
export const EASE_OUT_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

// ── Reveal ────────────────────────────────────────────────────────────────
/** Scroll-reveal distances. Blur is capped at 8px — past that it reads as lag. */
export const REVEAL_Y = 16;
export const REVEAL_BLUR = 8;
export const REVEAL_DURATION = 0.6;
/** Per-item delay in a revealed list. 50ms keeps a 12-card grid under 0.6s. */
export const REVEAL_STAGGER = 0.05;

// ── Press/hover scales ────────────────────────────────────────────────────
export const HOVER_SCALE = 1.02;
export const TAP_SCALE = 0.93;
/** Large surfaces (cards) need a far smaller delta to read as the same push. */
export const CARD_TAP_SCALE = 0.985;

/**
 * True when the visitor asked for less motion. Read at call time rather than
 * cached: the OS setting can flip while the tab is open.
 */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Same thing as a hook, so components re-render when the setting changes. */
export const useReducedMotion = () => {
  const [reduce, setReduce] = useState(prefersReducedMotion);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduce(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduce;
};

/** True on devices that can actually hover — tilt/glare are pointless on touch. */
export const useHoverCapable = () => {
  const [canHover, setCanHover] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onChange = () => setCanHover(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return canHover;
};

/** Any media query as a hook, for layout that has to branch in JS rather than CSS. */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia(query).matches,
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
};
