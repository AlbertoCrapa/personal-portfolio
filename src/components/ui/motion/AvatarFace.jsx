import React from 'react';
import { motion, useMotionValue } from 'framer-motion';

import { useReducedMotion } from '../../../utils/motion';

/**
 * AvatarFace — the little guy that lives between the first and last name.
 *
 * Three layers, deliberately kept apart:
 *
 *   POSE     — the emotion. One drawing, every face a row of numbers on the
 *              same channels, so poses interpolate instead of cutting.
 *   IDLE     — the life. Four loops that never stop, a blink schedule and a
 *              saccade schedule, all computed from the clock in one rAF pass.
 *              They compose with the pose because they sit on different groups
 *              of the same tree, so he keeps breathing while he is angry.
 *   DIRECTOR — the behaviour. Watches the page — pointer, scroll, tab, taps,
 *              the phone itself — and decides what he should be feeling. Poses
 *              are never picked at random; something you did caused each one.
 *
 * The first two layers follow the two reference labs (Alain00/blobatar,
 * smontlouis/bible-strong-avatar-lab): the channel/differential vocabulary and
 * mirroring rule from the first, the ambient periods, blink model and saccade
 * model from its idle driver, the lifecycle/reaction state split from the
 * second. The rule that matters most is theirs too: **eyes do not drift, they
 * jump and settle**.
 */

/* The drawing, traced off the reference rather than constructed: nothing here
   is a primitive. The head is a closed cubic whose anchors and handles are each
   off the true circle by a unit or so, the eye is an oval that is fatter at the
   top than the bottom, and the mouth is a deep `u` with its tips turned up —
   the three things that read as "drawn by a hand" instead of "drawn by a spec".
   The right eye mirrors the left, so the pair is never twice the same shape. */
const HEAD = 'M 50 9.8 C 72.9 9.4 90.6 28.4 90.3 50.4 C 90 72.6 71.4 90.7 49.6 90.4 '
    + 'C 27.2 90.1 9.4 71.6 9.7 49.6 C 10 27.7 27.6 10.1 50 9.8 Z';

const EYE = {
    cy: 41.5,
    dx: 15,
    path: 'M -0.2 -6.8 C 2.9 -7 4.5 -4.2 4.4 -0.6 C 4.3 3.1 3 6.6 -0.1 6.8 '
        + 'C -3.2 7 -4.5 3.6 -4.4 -0.2 C -4.3 -3.9 -3.1 -6.6 -0.2 -6.8 Z',
};

/* Ambient periods (ms). Nothing divides into anything else, so the loops never
   line up the same way twice — most of why he reads as alive, not as looping. */
const BREATHE = 2800;
const BOB = 3400;
const SWAY = 5200;
const TAU = Math.PI * 2;

/* Blink. Asymmetric on purpose: a lid falls faster than it lifts. */
const BLINK_MS = 165;
const BLINK_SHUT = 0.4;
const BLINK_GAP = [2600, 3900];
const DOUBLE_BLINK = 0.18;

/* Saccades: a held fixation, then a flick to the next. Never a glide. */
const SACCADE_GAP = [900, 2400];
const FLICK_TAU = 42;

/* Director thresholds (ms). */
const BORED_AFTER = 15000;
const ASLEEP_AFTER = 48000;
const BEAT_GAP = [7000, 7000];
const SPIN_LIMIT = TAU * 3.2; // radians of pointer orbit before he loses it
const SPIN_FORGET = 420; // pointer still this long and the orbit resets
const SCROLL_WOAH = 2100; // px/s
const SHAKE_JOLT = 14; // m/s² delta counted as one shake
const SHAKE_HITS = 5;

/* A pose can swap the eye oval for a drawn one. Both live in the tree and
   cross-fade, because a face that swaps elements mid-morph pops. */
const EYES = {
    // A drawn `>`: both arms bow, and the lower one overshoots the corner the
    // way a pen does when the hand keeps going a hair past the turn.
    hurt: 'M -4.5 -5.9 C -2.2 -4.2 1.2 -2.2 4.2 -0.3 C 1.5 1.7 -1.9 3.7 -4.1 5.8',
    // Two strokes that cross slightly off-centre and run past each other. A
    // mathematically perfect X is the one shape that gives the drawing away.
    cross: 'M -4.7 -4.3 C -2.3 -1.7 1.3 1.5 4.4 4.6 M 4.5 -4.5 C 2.2 -2.1 -1.5 1.2 -4.3 4.4',
    shut: 'M -5.2 -0.9 C -3.1 2.3 2.5 2.7 5.1 -0.4',
    heart: 'M 0.1 5.7 C -6.7 0.5 -5.2 -6.1 0.2 -3 C 5.6 -6.2 6.7 0.3 0 5.6',
};

/* Cheeks. Not a tint — two drawn blobs that fade in, because a blush is a mark
   on a face, not the whole face going pink. */
const CHEEK = {
    dx: 20.5, cy: 53,
    path: 'M -3.6 -0.3 C -3.5 -2.5 -1.3 -3.3 0.4 -3.1 C 2.6 -2.9 3.6 -1.3 3.5 0.4 '
        + 'C 3.3 2.5 1.3 3.4 -0.4 3.2 C -2.5 3 -3.7 1.8 -3.6 -0.3 Z',
};

/* Every mouth is `M · Q · Q ·` — ten numbers in the same slots, which is the
   whole reason any mouth can tween into any other. The resting mouth is the
   reference's `u` eased off: tips still turned up and a rounded floor, but
   shallower than the traced original, which read as a frown upside down.
   Poses that open the mouth set `mouthFill`, which fades in a filled twin of
   the same path — that is how one set of numbers serves both an arc and a hole. */
const MOUTH = {
    smile: 'M 42.6 55.6 Q 43.6 61.6 50.1 61.5 Q 56.6 61.4 57.4 55.4',
    smileUp: 'M 41.1 55 Q 42.4 62.4 50.1 62.3 Q 57.8 62.2 58.8 54.8',
    bigSmile: 'M 38.8 54.6 Q 40.6 64 50.2 63.9 Q 59.6 63.8 61 54.4',
    tiny: 'M 45.4 56.4 Q 46.2 60.6 50.1 60.5 Q 54 60.4 54.6 56.2',
    flat: 'M 43.5 60.2 Q 46.8 60.4 50.1 60.3 Q 53.4 60.2 56.6 60.4',
    unimpressed: 'M 43 59.8 Q 46.8 60.6 50.1 60.6 Q 53.6 60.7 57 61.5',
    frown: 'M 42.6 63 Q 43.6 57.4 50.1 57.5 Q 56.6 57.6 57.4 63.2',
    frownSmall: 'M 44.2 62.2 Q 45 58 50.1 58.1 Q 55.2 58.2 55.8 62',
    smirk: 'M 42.4 60.4 Q 44 64.2 50.4 63.6 Q 55.8 63 58.4 57.8',
    o: 'M 50 52.6 Q 56 59 50 65.4 Q 44 59 50 52.6',
    laugh: 'M 50 51.8 Q 59.4 59.2 50 67 Q 41 59.2 50 51.8',
    yawn: 'M 50 50.6 Q 58 60.5 50 70.4 Q 42.4 60.5 50 50.6',
    wave: 'M 42.4 60.2 Q 46.2 55.4 50.2 60.4 Q 54.2 65.4 58.2 60',
};

const BASE = {
    ex: 1, ey: 1, ang: 0, dx: 0, dy: 0, lx: 0,
    ex2: 0, ey2: 0, ang2: 0, dy2: 0,
    hy: 0, hs: 1, hr: 0,
    wobble: null, // [degrees, seconds] — a tremor the pose owns
    eye: null, // key of EYES, or null for the drawn oval
    eyeFill: false,
    mouth: MOUTH.smile,
    mouthFill: false,
    heat: 0, // how far toward `tone` the whole face runs
    blush: 0, // how strongly the cheeks show, in the same tone
    tone: '#ff4a3d',
};
const pose = (p) => ({ ...BASE, ...p });

/** The roster. Each face differs from its nearest neighbour on three channels
 *  at once — one channel apart is how two poses end up reading as the same. */
export const FACES = {
    neutral: pose({}),

    /* Hover. Deliberately tiny — eyes open a little, chin up a little, mouth a
       little wider. A full grin every time the cursor grazes him reads as a
       jingle, not as a creature noticing you. */
    perk: pose({ ex: 1.06, ey: 1.1, dy: -0.7, hy: -1.1, hs: 1.02, mouth: MOUTH.smileUp }),

    happy: pose({ ex: 1.22, ey: 0.4, dy: -1.4, hy: -1.2, mouth: MOUTH.bigSmile }),
    laugh: pose({ ex: 1.3, ey: 0.28, dy: -2.6, hs: 1.05, hy: -1.6, mouth: MOUTH.laugh, mouthFill: true, wobble: [1.6, 0.45] }),
    excited: pose({ ex: 1.3, ey: 1.35, dy: -1.8, hy: -2.4, hs: 1.05, mouth: MOUTH.bigSmile, wobble: [1.5, 0.19], blush: 0.45, tone: '#ff8fb1' }),
    wink: pose({ ex: 1.06, ey: 0.95, ex2: 0.3, ey2: -0.82, ang2: -12, dy: -0.6, mouth: MOUTH.smirk }),
    love: pose({ ex: 1.05, ey: 1.05, dy: -1.2, hy: -1.6, eye: 'heart', eyeFill: true, mouth: MOUTH.bigSmile, heat: 0.4, blush: 1, tone: '#ff5c8a' }),
    surprised: pose({ ex: 1.22, ey: 1.26, dx: 0.6, dy: -2, hy: -2.2, mouth: MOUTH.o, mouthFill: true }),
    woah: pose({ ex: 1.38, ey: 1.42, dy: -2.4, hy: -2.8, hs: 1.03, mouth: MOUTH.o, mouthFill: true }),
    curious: pose({ ex: 1.12, ey: 1.18, ex2: -0.26, ey2: -0.24, dy: -0.6, hr: 9, mouth: MOUTH.o, mouthFill: true }),

    sad: pose({ ex: 0.92, ey: 0.88, ang: -24, dx: 1.6, dy: 2.4, hy: 2.2, mouth: MOUTH.frown }),
    /* The stage anger passes through in both directions. A face that goes
       straight from resting to furious has not decided anything — it has been
       switched. This is the deciding. */
    annoyed: pose({ ex: 1.24, ey: 0.5, ang: 11, ang2: -5, dy: 0.2, hr: -2, mouth: MOUTH.unimpressed }),
    mad: pose({ ex: 1.6, ey: 0.34, ang: 30, dy: 0.4, hs: 0.97, mouth: MOUTH.frown, wobble: [2.6, 0.16], heat: 1 }),
    /* Getting poked. The capsules are gone — a squeezed `>_<` is the one thing
       a scaled pill cannot fake, and it is the whole read of a flinch. */
    hurt: pose({ ex: 1.1, ey: 0.95, dy: 0.4, hy: 1.4, hs: 0.96, eye: 'hurt', mouth: MOUTH.frownSmall, wobble: [3.4, 0.13], heat: 0.55, blush: 0.6, tone: '#ff6a52' }),

    bored: pose({ ex: 1.18, ey: 0.36, dy: 1.6, lx: 2.8, hr: -3, hy: 0.8, mouth: MOUTH.flat }),
    yawn: pose({ ex: 0.95, ey: 0.14, dy: 0.6, hy: 0.4, hs: 1.03, mouth: MOUTH.yawn, mouthFill: true }),
    sleepy: pose({ ex: 1.12, ey: 0.18, dy: 2.6, hy: 1.8, hr: -4, mouth: MOUTH.flat }),
    asleep: pose({ ex: 1, ey: 1, dy: 1.6, hy: 2.4, hr: -6, eye: 'shut', mouth: MOUTH.tiny }),

    smug: pose({ ex: 1.25, ey: 0.44, ang: 15, ang2: -30, dy: -0.4, hr: -6, mouth: MOUTH.smirk }),
    shy: pose({ ex: 0.8, ey: 0.6, ang: -10, dy: 1.6, hy: 1.2, hr: 5, mouth: MOUTH.tiny, heat: 0.22, blush: 1, tone: '#ff8fb1' }),
    thinking: pose({ ex: 1.1, ey: 0.66, lx: 2.8, dy: -1.6, dy2: -2.2, hr: 6, mouth: MOUTH.flat }),
    /* Spun too hard, by cursor or by phone. Crossed eyes plus a wavy mouth plus
       a slow whole-head roll — three channels, so it cannot be read as anything
       else in the roster. */
    dizzy: pose({ ex: 1.05, ey: 1.05, dy: -0.2, eye: 'cross', mouth: MOUTH.wave, wobble: [12, 1.05] }),
    meh: pose({ ex: 1.05, ey: 0.62, ang: 6, ang2: -14, mouth: MOUTH.flat }),
};

/** Keyboard walks the whole roster — the only way to see them all on purpose. */
const CYCLE = [
    'happy', 'wink', 'surprised', 'excited', 'laugh', 'smug', 'love', 'curious',
    'thinking', 'meh', 'bored', 'sleepy', 'asleep', 'yawn', 'shy', 'sad',
    'annoyed', 'mad', 'hurt', 'dizzy', 'woah',
];

/** Beats he plays to himself while nobody is touching him. Small ones only — a
 *  face that pulls a full expression unprompted reads as broken, not alive. */
const BEATS = ['thinking', 'happy', 'meh', 'wink', 'curious'];
/** Faces the director is allowed to walk into and out of on its own. */
const AMBIENT = new Set(['neutral', 'bored', 'asleep', ...BEATS]);

/* Entering a mood is faster and bouncier than leaving one, the split
   blobatar's stylesheet makes (300ms in / 400ms out); hover gets its own,
   shorter still (220/160). A face snaps into a mood and eases out of it. */
const MORPH_IN = { type: 'spring', duration: 0.34, bounce: 0.36 };
const MORPH_OUT = { type: 'spring', duration: 0.46, bounce: 0.16 };
const MORPH_HOVER = { type: 'spring', duration: 0.26, bounce: 0.2 };
const MOUTH_IN = { duration: 0.26, ease: [0.45, 0.05, 0.5, 1] };
const MOUTH_OUT = { duration: 0.38, ease: [0.45, 0.05, 0.5, 1] };
const SWAP = { duration: 0.09, delay: 0.06 };

const easeIn = (k) => k * k;
const easeOut = (k) => 1 - (1 - k) * (1 - k);
const rand = ([min, span]) => min + Math.random() * span;
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const clamp = (v, max) => Math.max(-max, Math.min(max, v));

const Eye = ({ side, p, lid, morph }) => {
    const right = side > 0;
    const drawn = Boolean(p.eye);

    return (
        <g transform={`translate(${50 + side * EYE.dx} ${EYE.cy})`}>
            {/* Placement and tilt on the group, squash inside it, so the capsule
                is flattened first and *then* tilted. The other order shears a
                squashed eye and eats most of the angle with it. */}
            <motion.g
                animate={{
                    x: side * p.dx + p.lx,
                    y: p.dy + (right ? p.dy2 : 0),
                    rotate: right ? p.ang + p.ang2 : -p.ang,
                }}
                transition={morph}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            >
                {/* The lid is its own group so a blink multiplies the pose
                    instead of fighting it — he can blink mid-squint. */}
                <motion.g style={{ scaleY: lid, transformBox: 'fill-box', transformOrigin: 'center' }}>
                    <motion.g
                        animate={{
                            scaleX: p.ex + (right ? p.ex2 : 0),
                            scaleY: p.ey + (right ? p.ey2 : 0),
                        }}
                        transition={morph}
                        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    >
                        <motion.path
                            d={EYE.path}
                            transform={right ? 'scale(-1 1)' : undefined}
                            fill="currentColor"
                            initial={{ opacity: drawn ? 0 : 1 }}
                            animate={{ opacity: drawn ? 0 : 1 }}
                            transition={SWAP}
                        />
                        {/* Mirrored on the right, which is what makes `>` into
                            `>_<` and leaves a heart a heart. */}
                        <motion.path
                            d={EYES[p.eye] || EYES.hurt}
                            transform={right ? 'scale(-1 1)' : undefined}
                            fill={p.eyeFill ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            strokeWidth={p.eyeFill ? 1.6 : 3.6}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ opacity: drawn ? 1 : 0 }}
                            animate={{ opacity: drawn ? 1 : 0 }}
                            transition={SWAP}
                        />
                    </motion.g>
                </motion.g>
            </motion.g>
        </g>
    );
};

/**
 * Props:
 *   size       – CSS length, em by default so it scales with the title it sits in
 *   expression – force a face (any key of FACES); omit to let him run himself
 *   delay      – entrance delay, to land after the title he belongs to
 */
const AvatarFace = ({
    size = '1.12em',
    expression,
    delay = 0.45,
    className = '',
    style,
    ...rest
}) => {
    const reduce = useReducedMotion();
    const ref = React.useRef(null);
    const [face, setFace] = React.useState('neutral');

    const active = expression || face;
    const p = FACES[active] || FACES.neutral;
    const morph = active === 'perk'
        ? MORPH_HOVER
        : active === 'neutral' ? MORPH_OUT : MORPH_IN;
    const mouthMorph = active === 'neutral' ? MOUTH_OUT : MOUTH_IN;
    // Own id rather than useId(): that one contains colons, which a fragment
    // reference in <use> will not take.
    const uid = React.useRef(`face-${Math.random().toString(36).slice(2, 9)}`).current;

    const poseRef = React.useRef(p);
    const prevEye = React.useRef(p.eye);
    poseRef.current = p;
    const faceRef = React.useRef(face);
    faceRef.current = face;

    /* ── Idle layer: one rAF, every channel a function of the clock. ── */
    const bobY = useMotionValue(0);
    const swayR = useMotionValue(0);
    const brX = useMotionValue(1);
    const brY = useMotionValue(1);
    const lid = useMotionValue(1);
    const lookX = useMotionValue(0);
    const lookY = useMotionValue(0);
    const headX = useMotionValue(0);
    const headY = useMotionValue(0);
    const mouthX = useMotionValue(0);
    const mouthY = useMotionValue(0);
    const popX = useMotionValue(1);
    const popY = useMotionValue(1);
    const trem = useMotionValue(0);

    const S = React.useRef({
        t0: 0, last: 0,
        nextBlink: 0, blinkAt: -1, again: false,
        nextSac: 0, sacX: 0, sacY: 0, curX: 0, curY: 0,
        ptrX: 0, ptrY: 0, ptrAt: -1e9,
        popAt: -1e9, tremAmp: 0,
        // director
        lastAct: 0, holdUntil: 0, nextBeat: 0,
        spin: 0, lastAng: null, spinAt: 0,
        scrollY: 0, scrollAt: 0,
        pokes: 0, pokeAt: -1e9, cyc: -1, hover: false, link: null,
        seq: [], calm: 0, bottom: false,
        shakeHits: 0, shakeAt: 0, lastMag: 0, askedMotion: false,
        timer: null,
    });

    /** Hold a reaction for `ms`, after which the director takes him back. */
    const say = React.useCallback((name, ms = 0) => {
        const s = S.current;
        s.holdUntil = performance.now() + ms;
        setFace(name);
    }, []);

    /**
     * Play a short script of poses. Reactions are written as scripts rather
     * than single poses because a mood that arrives in one jump reads as a
     * switch being thrown: anger goes resting → annoyed → furious → annoyed →
     * unbothered, and every one of those beats is him deciding something.
     */
    const step = React.useCallback(() => {
        const s = S.current;
        const next = s.seq.shift();
        if (!next) {
            // A settling gap after every script, so the next thing that happens
            // on the page cannot yank him straight into another mood.
            s.calm = performance.now() + 700;
            return;
        }
        say(next[0], next[1]);
        s.timer = setTimeout(step, next[1]);
    }, [say]);

    const play = React.useCallback((steps) => {
        const s = S.current;
        clearTimeout(s.timer);
        s.seq = steps.slice();
        step();
    }, [step]);

    /** True when the page is allowed to interrupt him. */
    const open = React.useCallback(() => {
        const now = performance.now();
        return now >= S.current.holdUntil && now >= S.current.calm;
    }, []);

    /** Anything the visitor does. Resets the boredom clock and wakes him. */
    const act = React.useCallback(() => {
        const s = S.current;
        s.lastAct = performance.now();
        // Waking is groggy, never instant — surprised, then a beat of nothing.
        if (faceRef.current === 'asleep') play([['surprised', 620], ['meh', 780]]);
        else if (faceRef.current === 'bored' && performance.now() >= s.holdUntil) say('neutral');
    }, [say, play]);

    /* An eye that changes shape does it behind closed lids — the oldest cut in
       hand-drawn animation, and the reason a swap reads as a decision rather
       than as two drawings dissolving through each other. */
    React.useEffect(() => {
        if (prevEye.current !== p.eye) {
            prevEye.current = p.eye;
            S.current.blinkAt = performance.now();
        }
    }, [p.eye]);

    React.useEffect(() => {
        if (reduce) return undefined;
        const s = S.current;
        s.t0 = s.last = s.lastAct = performance.now();
        s.nextBlink = s.t0 + rand(BLINK_GAP);
        s.nextSac = s.t0 + rand(SACCADE_GAP);
        s.nextBeat = s.t0 + rand(BEAT_GAP);
        let raf;

        const tick = (now) => {
            raf = requestAnimationFrame(tick);
            const dt = Math.min(48, now - s.last);
            s.last = now;
            const t = now - s.t0;
            const sleeping = faceRef.current === 'asleep';

            // Breathing is non-uniform — he widens as he rises and narrows as he
            // sinks. A uniform pulse reads as a zoom, not as a lung. Asleep, it
            // slows down and deepens, which is the whole tell.
            const rate = sleeping ? 0.55 : 1;
            const b = Math.sin(((t * rate) / BREATHE) * TAU);
            brX.set(1 + (sleeping ? 0.03 : 0.022) * b);
            brY.set(1 - (sleeping ? 0.026 : 0.018) * b);
            bobY.set(-1.1 * Math.sin(((t * rate) / BOB) * TAU + 1.7));
            swayR.set(0.9 * Math.sin((t / SWAY) * TAU + 0.6));

            // ── Blink (not while the eyes are already drawn shut) ──
            if (poseRef.current.eye) {
                lid.set(1);
                s.blinkAt = -1;
                s.nextBlink = now + rand(BLINK_GAP);
            } else {
                if (s.blinkAt < 0 && now >= s.nextBlink) s.blinkAt = now;
                if (s.blinkAt >= 0) {
                    const k = (now - s.blinkAt) / BLINK_MS;
                    if (k >= 1) {
                        lid.set(1);
                        s.blinkAt = -1;
                        if (s.again) {
                            s.again = false;
                            s.nextBlink = now + 120;
                        } else {
                            s.nextBlink = now + rand(BLINK_GAP);
                            s.again = Math.random() < DOUBLE_BLINK;
                        }
                    } else {
                        const v = k < BLINK_SHUT
                            ? easeIn(k / BLINK_SHUT)
                            : 1 - easeOut((k - BLINK_SHUT) / (1 - BLINK_SHUT));
                        lid.set(1 - 0.94 * v);
                    }
                }
            }

            // ── Gaze: the cursor while it moves, his own fixations after ──
            const live = now - s.ptrAt < 1100 && !sleeping;
            // Asleep he does not look at anything. Eyes drift to centre and the
            // saccade schedule stops being wound — a sleeping face that keeps
            // glancing around is the single loudest tell that nobody is home.
            if (sleeping) {
                s.sacX = 0;
                s.sacY = 0;
                s.nextSac = now + 4000;
            } else if (!live && now >= s.nextSac) {
                s.sacX = (Math.random() * 2 - 1) * 2.8;
                s.sacY = (Math.random() * 2 - 1) * 1.6;
                s.nextSac = now + rand(SACCADE_GAP);
            }
            const tx = live ? s.ptrX : s.sacX;
            const ty = live ? s.ptrY : s.sacY;
            const a = 1 - Math.exp(-dt / FLICK_TAU);
            s.curX += (tx - s.curX) * a;
            s.curY += (ty - s.curY) * a;
            lookX.set(s.curX);
            lookY.set(s.curY);
            // The head follows a third of the way, the mouth a third: the
            // parallax is what stops the face sliding around as one slab.
            headX.set(s.curX * 0.32);
            headY.set(s.curY * 0.32);
            mouthX.set(s.curX * 0.34);
            mouthY.set(s.curY * 0.34);

            // ── Pop: a damped wobble, fired only by a deliberate poke ──
            const pk = (now - s.popAt) / 460;
            if (pk >= 0 && pk < 1) {
                const e = Math.exp(-4.2 * pk) * Math.sin(pk * Math.PI * 2.6);
                popX.set(1 + 0.17 * e);
                popY.set(1 - 0.14 * e);
            } else if (popX.get() !== 1) {
                popX.set(1);
                popY.set(1);
            }

            // ── Tremor: amplitude eases, so mad arrives shaking rather than
            //    switching a vibration on. ──
            const w = poseRef.current.wobble;
            s.tremAmp += ((w ? w[0] : 0) - s.tremAmp) * (1 - Math.exp(-dt / 130));
            trem.set(s.tremAmp * Math.sin((t / ((w ? w[1] : 0.3) * 1000)) * TAU));
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [reduce, bobY, swayR, brX, brY, lid, lookX, lookY, headX, headY, mouthX, mouthY, popX, popY, trem]);

    /* ── What the page is doing to him ── */
    React.useEffect(() => {
        if (reduce || expression) return undefined;
        const s = S.current;

        const onMove = (e) => {
            const el = ref.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const now = performance.now();
            s.ptrX = clamp(dx / 80, 3.6);
            s.ptrY = clamp(dy / 80, 2.8);
            s.ptrAt = now;
            s.lastAct = now;
            if (faceRef.current === 'asleep' || faceRef.current === 'bored') act();

            // Orbiting him winds him up. Signed angle, so a circle accumulates
            // and a scribble cancels itself out — which is the difference
            // between "you are spinning me" and "you are just moving".
            const ang = Math.atan2(dy, dx);
            if (s.lastAng === null || now - s.spinAt > SPIN_FORGET || Math.hypot(dx, dy) > r.width * 7) {
                s.spin = 0;
            } else {
                let d = ang - s.lastAng;
                if (d > Math.PI) d -= TAU;
                if (d < -Math.PI) d += TAU;
                if (Math.abs(d) < 0.9) s.spin += d;
            }
            s.lastAng = ang;
            s.spinAt = now;
            if (Math.abs(s.spin) > SPIN_LIMIT && open()) {
                s.spin = 0;
                play([['dizzy', 2200], ['meh', 800]]);
            }
        };

        // Anything that leaves the site: the social dock, a mail link, an
        // external project link. Selector rather than a prop, so the top bar
        // stays untouched and any future link is covered for free.
        const onOver = (e) => {
            const a = e.target && e.target.closest && e.target.closest('a[href]');
            const away = a && (a.target === '_blank' || (a.getAttribute('href') || '').startsWith('mailto:'));
            if (!away) {
                s.link = null;
                return;
            }
            if (a === s.link) return;
            s.link = a;
            s.lastAct = performance.now();
            if (open()) play([['wink', 900], ['perk', 500]]);
        };

        const onScroll = () => {
            const now = performance.now();
            const dt = now - s.scrollAt;
            const v = dt > 0 ? Math.abs(window.scrollY - s.scrollY) / (dt / 1000) : 0;
            const dir = Math.sign(window.scrollY - s.scrollY);
            s.scrollY = window.scrollY;
            s.scrollAt = now;
            s.lastAct = now;
            // He glances the way the page is going, and flinches if it bolts.
            s.sacY = clamp(dir * 1.7, 1.7);
            s.nextSac = now + 420;
            if (v > SCROLL_WOAH && open()) play([['woah', 560], ['perk', 420]]);
            else if (faceRef.current === 'asleep' || faceRef.current === 'bored') act();

            // Hitting the end of the page is worth something.
            const end = window.innerHeight + window.scrollY >= document.body.scrollHeight - 8;
            if (end && !s.bottom && open()) play([['excited', 900], ['happy', 800]]);
            s.bottom = end;
        };

        const onVisible = () => {
            if (document.visibilityState !== 'visible') return;
            s.lastAct = performance.now();
            if (open()) play([['surprised', 620], ['perk', 600]]);
        };

        // The rest of the site, watched rather than wired: the theme switch
        // flips an attribute, selecting text fires an event, typing fires an
        // event. None of them needs to know he exists.
        const theme = new MutationObserver(() => {
            s.lastAct = performance.now();
            if (open()) play([['surprised', 480], ['happy', 900]]);
        });
        theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        const onSelect = () => {
            const sel = window.getSelection();
            if (!sel || sel.isCollapsed || String(sel).length < 3) return;
            s.lastAct = performance.now();
            if (open()) play([['curious', 1000]]);
        };

        const onKey = (e) => {
            if (e.key.length !== 1 && e.key !== 'Backspace') return;
            s.lastAct = performance.now();
            if (open()) play([['thinking', 1400]]);
        };

        const onResize = () => {
            s.lastAct = performance.now();
            if (open()) play([['woah', 600], ['meh', 500]]);
        };

        const onMenu = () => {
            s.lastAct = performance.now();
            if (open()) play([['meh', 900]]);
        };

        // Shake the phone and he loses his balance. Desktop never fires this.
        const onMotion = (e) => {
            const g = e.accelerationIncludingGravity;
            if (!g) return;
            const mag = Math.hypot(g.x || 0, g.y || 0, g.z || 0);
            const now = performance.now();
            if (now - s.shakeAt > 1200) s.shakeHits = 0;
            if (Math.abs(mag - s.lastMag) > SHAKE_JOLT) {
                s.shakeHits += 1;
                s.shakeAt = now;
                s.lastAct = now;
                if (s.shakeHits >= SHAKE_HITS) {
                    s.shakeHits = 0;
                    say('dizzy', 2400);
                }
            }
            s.lastMag = mag;
        };

        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('pointerover', onOver, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });
        window.addEventListener('keydown', onKey, { passive: true });
        window.addEventListener('contextmenu', onMenu, { passive: true });
        document.addEventListener('selectionchange', onSelect);
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('devicemotion', onMotion);
        document.addEventListener('visibilitychange', onVisible);
        return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerover', onOver);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('contextmenu', onMenu);
            document.removeEventListener('selectionchange', onSelect);
            theme.disconnect();
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('devicemotion', onMotion);
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, [reduce, expression, say, act, play, open]);

    /* ── Director: boredom, sleep, and the beats in between ── */
    React.useEffect(() => {
        if (reduce || expression) return undefined;
        const s = S.current;
        const id = setInterval(() => {
            const now = performance.now();
            if (now < s.holdUntil) return; // a reaction is still playing
            const f = faceRef.current;
            if (!AMBIENT.has(f)) {
                setFace(s.hover ? 'perk' : 'neutral'); // a held reaction expired
                return;
            }
            if (s.hover) {
                if (f !== 'perk') setFace('perk');
                return;
            }
            const idle = now - s.lastAct;
            if (idle > ASLEEP_AFTER) {
                if (f !== 'asleep') setFace('asleep');
                return;
            }
            if (idle > BORED_AFTER) {
                if (f !== 'bored') {
                    setFace('bored');
                    s.nextBeat = now + rand(BEAT_GAP);
                } else if (now > s.nextBeat) {
                    say('yawn', 1300);
                    s.nextBeat = now + 9000 + Math.random() * 9000;
                }
                return;
            }
            if (f !== 'neutral') {
                setFace('neutral');
            } else if (now > s.nextBeat) {
                say(pick(BEATS), 800 + Math.random() * 500);
                s.nextBeat = now + rand(BEAT_GAP);
            }
        }, 260);
        return () => clearInterval(id);
    }, [reduce, expression, say, play]);

    React.useEffect(() => () => clearTimeout(S.current.timer), []);

    /* ── Direct interaction ── */
    const poke = () => {
        const s = S.current;
        const now = performance.now();
        act();
        s.popAt = now;
        s.pokes = now - s.pokeAt < 1200 ? s.pokes + 1 : 1;
        s.pokeAt = now;
        // The flinch is the reflex. Everything after it is him making his mind
        // up, and it escalates — and comes back down — one stage at a time.
        if (s.pokes >= 5) play([['dizzy', 2300], ['annoyed', 900], ['meh', 700]]);
        else if (s.pokes >= 3) play([['hurt', 320], ['annoyed', 460], ['mad', 1500], ['annoyed', 800], ['meh', 600]]);
        else if (s.pokes === 2) play([['hurt', 380], ['annoyed', 700], ['sad', 1000]]);
        else play([['hurt', 420], ['annoyed', 820], ['perk', 500]]);
    };

    const cycle = () => {
        const s = S.current;
        act();
        s.popAt = performance.now();
        s.cyc = (s.cyc + 1) % CYCLE.length;
        say(CYCLE[s.cyc], 2600);
    };

    const leave = React.useRef(null);
    // Leaving is deferred: a cursor crossing him twice in a second should let
    // the same spring keep running, not restart the reaction each pass.
    const onLeave = () => {
        S.current.hover = false;
        clearTimeout(leave.current);
        leave.current = setTimeout(() => {
            const s = S.current;
            if (performance.now() < s.holdUntil) return;
            if (faceRef.current === 'perk') setFace('neutral');
        }, 180);
    };
    React.useEffect(() => () => clearTimeout(leave.current), []);

    return (
        <motion.span
            ref={ref}
            className={className}
            role="button"
            tabIndex={0}
            aria-label={`Avatar, currently ${active}. Activate to change its expression.`}
            onPointerEnter={() => {
                clearTimeout(leave.current);
                S.current.hover = true;
                act();
                if (performance.now() >= S.current.holdUntil && AMBIENT.has(faceRef.current)) {
                    say('perk');
                }
            }}
            onPointerLeave={onLeave}
            // Stops a click, or a four-tap rampage, from dragging a selection
            // across the name he sits inside.
            onMouseDown={(e) => e.preventDefault()}
            onPointerDown={() => {
                // iOS hands out motion events only after an explicit grant, and
                // only from a gesture. Asked once, on the first poke, ignored if
                // refused — the shake is a bonus, never a gate.
                const s = S.current;
                const DM = typeof window !== 'undefined' && window.DeviceMotionEvent;
                if (!s.askedMotion && DM && typeof DM.requestPermission === 'function') {
                    s.askedMotion = true;
                    DM.requestPermission().catch(() => {});
                }
            }}
            onClick={poke}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    cycle();
                }
            }}
            whileTap={reduce ? undefined : { scale: 0.86 }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.35, rotate: -35 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={reduce ? { duration: 0.25 } : { type: 'spring', duration: 0.7, bounce: 0.5, delay }}
            style={{
                display: 'inline-block',
                width: size,
                height: size,
                margin: '0 0.11em',
                verticalAlign: '-0.17em',
                cursor: 'pointer',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                outlineOffset: '0.12em',
                ...style,
            }}
            {...rest}
        >
            <svg
                viewBox="0 0 100 100"
                width="100%"
                height="100%"
                fill="none"
                aria-hidden="true"
                focusable="false"
                style={{ display: 'block', overflow: 'visible' }}
            >
                <g id={uid}>
                {/* bob + sway */}
                <motion.g style={{ y: bobY, rotate: swayR, transformBox: 'fill-box', transformOrigin: 'center' }}>
                    {/* breathe + poke pop, both non-uniform */}
                    <motion.g style={{ scaleX: brX, scaleY: brY, transformBox: 'fill-box', transformOrigin: 'center' }}>
                        <motion.g style={{ scaleX: popX, scaleY: popY, transformBox: 'fill-box', transformOrigin: 'center' }}>
                            {/* head channels of the pose */}
                            <motion.g
                                animate={{ y: p.hy, scale: p.hs, rotate: p.hr }}
                                transition={morph}
                                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                            >
                                <motion.g style={{ x: headX, y: headY }}>
                                    <motion.g style={{ rotate: trem, transformBox: 'fill-box', transformOrigin: 'center' }}>
                                        <path
                                            d={HEAD}
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            strokeLinejoin="round"
                                        />

                                        {/* Cheeks. Painted in the pose's own tone
                                            rather than currentColor, so a blush
                                            stays a blush whatever colour the
                                            rest of him is inheriting. */}
                                        <motion.g
                                            style={{ x: mouthX, y: mouthY }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: p.blush }}
                                            transition={morph}
                                        >
                                            <path
                                                d={CHEEK.path}
                                                transform={`translate(${50 - CHEEK.dx} ${CHEEK.cy})`}
                                                fill={p.tone}
                                            />
                                            <path
                                                d={CHEEK.path}
                                                transform={`translate(${50 + CHEEK.dx} ${CHEEK.cy}) scale(-1 1)`}
                                                fill={p.tone}
                                            />
                                        </motion.g>

                                        <motion.g style={{ x: lookX, y: lookY }}>
                                            <Eye side={-1} p={p} lid={lid} morph={morph} />
                                            <Eye side={1} p={p} lid={lid} morph={morph} />
                                        </motion.g>
                                        <motion.g style={{ x: mouthX, y: mouthY }}>
                                            {/* Same ten numbers, twice: the stroke is always
                                                drawn, the fill fades in only for the poses
                                                that open his mouth. */}
                                            <motion.path
                                                d={MOUTH.smile}
                                                animate={{ d: p.mouth, opacity: p.mouthFill ? 1 : 0 }}
                                                initial={{ opacity: 0 }}
                                                transition={mouthMorph}
                                                fill="currentColor"
                                                stroke="none"
                                            />
                                            <motion.path
                                                d={MOUTH.smile}
                                                animate={{ d: p.mouth }}
                                                transition={mouthMorph}
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </motion.g>
                                    </motion.g>
                                </motion.g>
                            </motion.g>
                        </motion.g>
                    </motion.g>
                </motion.g>
                </g>

                {/* Heat. The same face again, in the pose's colour, faded in over
                    the original — a live <use> clone, so it inherits every
                    transform the idle loop is writing and never drifts out of
                    register. Cheaper and far more robust than interpolating the
                    inherited `currentColor` the rest of the site paints him with. */}
                <motion.g
                    style={{ color: p.tone }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: p.heat }}
                    transition={morph}
                >
                    <use href={`#${uid}`} />
                </motion.g>
            </svg>
        </motion.span>
    );
};

export default AvatarFace;
