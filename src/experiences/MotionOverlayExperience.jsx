import React, { useCallback, useEffect, useRef, useState } from 'react';
import Button from '../components/ui/Button';

// Pinned to the installed @mediapipe/tasks-vision version so the JS API and
// the wasm binary it loads never drift out of sync with each other. The
// library itself is loaded from the same pinned CDN copy at runtime rather
// than bundled (see the import in startExperience below).
const TASKS_VISION_VERSION = '0.10.35';
const TASKS_VISION_CDN = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}`;
const TASKS_VISION_MODULE_URL = `${TASKS_VISION_CDN}/vision_bundle.mjs`;
const WASM_BASE = `${TASKS_VISION_CDN}/wasm`;
const FACE_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task';
// GestureRecognizer (not the plainer HandLandmarker) — it classifies the hand
// into a fixed canonical set on top of giving the same 21 landmarks.
const GESTURE_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/latest/gesture_recognizer.task';

const FACE_NOSE_TIP_INDEX = 1;
// Wrist + the four finger MCP joints — averaging these gives a stable palm
// center that doesn't jump around as fingers move, unlike a single joint.
const PALM_LANDMARK_INDICES = [0, 5, 9, 13, 17];
const SMOOTHING = 0.35; // lower = smoother/laggier, higher = snappier/jittery
const GESTURE_CONFIDENCE_THRESHOLD = 0.6;
const LABEL_HOLD_FRAMES = 3; // consecutive matching frames before switching the shown icon — filters one-frame flicker

const DEFAULT_FACE_EMOJI = '🙂';
const DEFAULT_HAND_EMOJI = '🖐';

// Google's pretrained Gesture Recognizer classifies this fixed set (plus
// "None"). It's a real trained model, so it takes priority whenever it's
// confident; CUSTOM_GESTURE_EMOJI below fills in a few more from raw
// landmark geometry for poses the canonical model doesn't cover.
const GESTURE_EMOJI = {
  Closed_Fist: '✊',
  Open_Palm: '✋',
  Pointing_Up: '👆',
  Thumb_Up: '👍',
  Thumb_Down: '👎',
  Victory: '✌️',
  ILoveYou: '🤟',
};

// Hand landmark indices (MediaPipe's 21-point hand model).
const WRIST = 0;
const THUMB_MCP = 2;
const THUMB_TIP = 4;
const INDEX_TIP = 8;
const MIDDLE_MCP = 9;
const MIDDLE_TIP = 12;
const RING_TIP = 16;
const PINKY_MCP = 17;
const PINKY_TIP = 20;

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// Distance-from-wrist comparison rather than a fixed up/down check, so it
// still works with the hand rotated sideways or upside down in frame.
function fingerExtended(lm, tipIdx, pipIdx) {
  return dist(lm[tipIdx], lm[WRIST]) > dist(lm[pipIdx], lm[WRIST]) * 1.15;
}

// The thumb moves sideways rather than curling toward the wrist like the
// other fingers, so it's checked against the pinky side of the palm instead.
function thumbExtended(lm) {
  return dist(lm[THUMB_TIP], lm[PINKY_MCP]) > dist(lm[THUMB_MCP], lm[PINKY_MCP]) * 1.05;
}

// Poses outside the canonical model's 7 categories, read straight off the 21
// landmarks. Thresholds (touch distance, extension margins) are a best-effort
// geometric estimate, not empirically tuned against a real camera in this
// environment — nudge them if a shape reads wrong in practice.
const CUSTOM_GESTURE_EMOJI = {
  OK_Sign: '👌',
  Rock_On: '🤘',
  Call_Me: '🤙',
  Middle_Finger: '🖕',
};

function detectCustomGesture(lm) {
  const thumb = thumbExtended(lm);
  const index = fingerExtended(lm, INDEX_TIP, 6);
  const middle = fingerExtended(lm, MIDDLE_TIP, 10);
  const ring = fingerExtended(lm, RING_TIP, 14);
  const pinky = fingerExtended(lm, PINKY_TIP, 18);

  if (dist(lm[THUMB_TIP], lm[INDEX_TIP]) < 0.06 && middle && ring && pinky) return 'OK_Sign';
  if (!thumb && index && !middle && !ring && pinky) return 'Rock_On';
  if (thumb && !index && !middle && !ring && pinky) return 'Call_Me';
  if (!thumb && !index && middle && !ring && !pinky) return 'Middle_Finger';
  return null;
}

// Ordered face-blendshape heuristics — first match wins, so put more
// specific/extreme expressions ahead of broader ones (a big open-mouth grin
// should read as "laughing", not just "smiling").
const FACE_EXPRESSIONS = [
  {
    emoji: '😮',
    test: (s) => s.jawOpen > 0.5 && (s.browInnerUp > 0.3 || s.browOuterUpLeft > 0.3 || s.browOuterUpRight > 0.3),
  },
  { emoji: '😆', test: (s) => (s.mouthSmileLeft + s.mouthSmileRight) / 2 > 0.5 && s.jawOpen > 0.2 },
  { emoji: '😄', test: (s) => (s.mouthSmileLeft + s.mouthSmileRight) / 2 > 0.35 },
  {
    emoji: '😉',
    test: (s) => Math.abs(s.eyeBlinkLeft - s.eyeBlinkRight) > 0.5 && Math.max(s.eyeBlinkLeft, s.eyeBlinkRight) > 0.6,
  },
  { emoji: '😗', test: (s) => s.mouthPucker > 0.4 },
  { emoji: '😠', test: (s) => (s.browDownLeft + s.browDownRight) / 2 > 0.5 },
  { emoji: '😢', test: (s) => (s.mouthFrownLeft + s.mouthFrownRight) / 2 > 0.35 },
];

function pickFaceEmoji(categories) {
  if (!categories || categories.length === 0) return DEFAULT_FACE_EMOJI;
  const scores = {};
  categories.forEach((c) => { scores[c.categoryName] = c.score; });
  const match = FACE_EXPRESSIONS.find((expr) => expr.test(scores));
  return match ? match.emoji : DEFAULT_FACE_EMOJI;
}

function pickHandEmoji(categoryName, score, landmarks) {
  if (categoryName && categoryName !== 'None' && score >= GESTURE_CONFIDENCE_THRESHOLD) {
    return GESTURE_EMOJI[categoryName] || DEFAULT_HAND_EMOJI;
  }
  const custom = landmarks && detectCustomGesture(landmarks);
  return custom ? CUSTOM_GESTURE_EMOJI[custom] : DEFAULT_HAND_EMOJI;
}

// "External" (thumb toward the pinky/outer edge of the hand as shown on
// screen) vs "internal" (thumb toward the frame's center) — flips the icon
// glyph to match so it doesn't sit backwards relative to the real hand.
// Hysteresis (two separate thresholds for flipping on vs off) stops the icon
// flickering when the thumb sits right at the midline.
const THUMB_SIDE_DEADZONE = 0.02;
function updateHandFlip(holdState, key, lm) {
  const entry = holdState[key] || { flipped: false };
  const side = lm[THUMB_TIP].x - lm[MIDDLE_MCP].x;
  if (!entry.flipped && side > THUMB_SIDE_DEADZONE) entry.flipped = true;
  else if (entry.flipped && side < -THUMB_SIDE_DEADZONE) entry.flipped = false;
  holdState[key] = entry;
  return entry.flipped;
}

// Requires the same label for LABEL_HOLD_FRAMES consecutive frames before
// committing to it, so a single misread frame doesn't flash the icon.
function debounceLabel(holdState, key, candidate) {
  const entry = holdState[key] || { committed: null, pending: null, count: 0 };
  if (candidate === entry.pending) {
    entry.count += 1;
  } else {
    entry.pending = candidate;
    entry.count = 1;
  }
  if (entry.count >= LABEL_HOLD_FRAMES) entry.committed = candidate;
  holdState[key] = entry;
  return entry.committed || candidate;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// "object-fit: cover" mapping: the video is cropped to fill the container,
// so a landmark's normalized [0,1] coordinate isn't a straight percentage of
// the container — it has to go through the same scale or the icon drifts
// off the tracked point whenever the aspect ratios don't match.
function computeCoverMapping(containerW, containerH, videoW, videoH) {
  if (!videoW || !videoH || !containerW || !containerH) return null;
  const scale = Math.max(containerW / videoW, containerH / videoH);
  const renderedW = videoW * scale;
  const renderedH = videoH * scale;
  return {
    offsetX: (containerW - renderedW) / 2,
    offsetY: (containerH - renderedH) / 2,
    renderedW,
    renderedH,
  };
}

function positionIcon(el, point, mapping, smoothed, key) {
  if (!el) return;

  if (!point || !mapping) {
    el.style.opacity = '0';
    return;
  }

  const targetX = mapping.offsetX + point.x * mapping.renderedW;
  const targetY = mapping.offsetY + point.y * mapping.renderedH;
  const prev = smoothed[key] || { x: targetX, y: targetY };
  const factor = prefersReducedMotion() ? 1 : SMOOTHING;
  const x = prev.x + (targetX - prev.x) * factor;
  const y = prev.y + (targetY - prev.y) * factor;
  smoothed[key] = { x, y };

  el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  el.style.opacity = '1';
}

function setIconGlyph(el, emoji) {
  const span = el?.firstElementChild;
  if (span && span.textContent !== emoji) span.textContent = emoji;
}

// The span's default inline transform (scaleX(-1)) counters the parent
// mirror layer so the glyph reads right-way-round; flipping it to scaleX(1)
// instead lets it inherit that mirror, i.e. shows the glyph reversed to
// match the thumb sitting on the opposite side of the hand.
function setIconFlip(el, flipped) {
  const span = el?.firstElementChild;
  if (span) span.style.transform = flipped ? 'scaleX(1)' : 'scaleX(-1)';
}

const IconBadge = React.forwardRef(({ defaultIcon }, ref) => (
  <div
    ref={ref}
    className="absolute top-0 left-0 flex items-center justify-center w-14 h-14 rounded-full bg-bg/70 backdrop-blur-sm border border-border text-2xl opacity-0 pointer-events-none"
    style={{ transition: 'opacity 220ms ease', willChange: 'transform, opacity' }}
    aria-hidden="true"
  >
    <span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>{defaultIcon}</span>
  </div>
));

/**
 * MotionOverlayExperience — webcam face + hand tracking with an icon overlay
 * that reacts to expression/gesture, entirely client-side (MediaPipe Tasks
 * Vision, no upload).
 *
 * Camera access is gated behind an explicit "Enable camera" step rather than
 * requested on mount, so the sensitive permission prompt is always a direct
 * result of the user's own action.
 */
const MotionOverlayExperience = ({ onReady }) => {
  const [phase, setPhase] = useState('idle'); // idle | requesting | loading | running | denied | error

  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const faceIconRef = useRef(null);
  const handIconRefs = useRef([]);

  const streamRef = useRef(null);
  const modelsRef = useRef({ face: null, gesture: null });
  const rafRef = useRef(null);
  const smoothedRef = useRef({});
  const labelHoldRef = useRef({});
  const flipHoldRef = useRef({});
  const mountedRef = useRef(true);

  const stopEverything = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    modelsRef.current.face?.close();
    modelsRef.current.gesture?.close();
    modelsRef.current = { face: null, gesture: null };
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(
    () => () => {
      mountedRef.current = false;
      stopEverything();
    },
    [stopEverything],
  );

  // Unlike AiDemoExperience (nothing to show until the wasm module is up),
  // this experience has a meaningful first paint immediately: the
  // enable-camera prompt. Signal "ready" on mount so the host page's loading
  // overlay clears and that prompt — and its button — actually becomes
  // visible/clickable, instead of sitting hidden until getUserMedia resolves
  // (which it never would, since nothing could click the button).
  useEffect(() => {
    onReady?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startExperience = useCallback(async () => {
    setPhase('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;

      const video = videoRef.current;
      video.srcObject = stream;
      await video.play();
      if (!mountedRef.current) return;

      setPhase('loading');

      // webpackIgnore keeps this a native browser import of the pinned CDN
      // build instead of a bundled chunk: the package ships a dynamic
      // require() and a broken source-map reference, both of which webpack
      // can only report as build warnings. Loading it at runtime also keeps
      // the wasm glue out of the app bundle — and the wasm/model assets it
      // pulls already come from this same CDN.
      const { FilesetResolver, FaceLandmarker, GestureRecognizer } = await import(
        /* webpackIgnore: true */ TASKS_VISION_MODULE_URL
      );
      const fileset = await FilesetResolver.forVisionTasks(WASM_BASE);
      if (!mountedRef.current) return;

      const [faceLandmarker, gestureRecognizer] = await Promise.all([
        FaceLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: FACE_MODEL_URL, delegate: 'GPU' },
          runningMode: 'VIDEO',
          numFaces: 1,
          outputFaceBlendshapes: true,
        }),
        GestureRecognizer.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: GESTURE_MODEL_URL, delegate: 'GPU' },
          runningMode: 'VIDEO',
          numHands: 2,
        }),
      ]);

      if (!mountedRef.current) {
        faceLandmarker.close();
        gestureRecognizer.close();
        return;
      }
      modelsRef.current = { face: faceLandmarker, gesture: gestureRecognizer };
      setPhase('running');
      onReady?.();

      const loop = () => {
        rafRef.current = requestAnimationFrame(loop);
        const { face, gesture } = modelsRef.current;
        const container = containerRef.current;
        const vid = videoRef.current;
        if (!face || !gesture || !container || !vid || vid.readyState < 2) return;

        const now = performance.now();
        const faceResult = face.detectForVideo(vid, now);
        const gestureResult = gesture.recognizeForVideo(vid, now);
        const mapping = computeCoverMapping(
          container.clientWidth,
          container.clientHeight,
          vid.videoWidth,
          vid.videoHeight,
        );

        const faceLandmarks = faceResult.faceLandmarks?.[0];
        const faceIconEl = faceIconRef.current;
        positionIcon(faceIconEl, faceLandmarks ? faceLandmarks[FACE_NOSE_TIP_INDEX] : null, mapping, smoothedRef.current, 'face');
        if (faceLandmarks) {
          const blendshapes = faceResult.faceBlendshapes?.[0]?.categories;
          const label = debounceLabel(labelHoldRef.current, 'face', pickFaceEmoji(blendshapes));
          setIconGlyph(faceIconEl, label);
        }

        const hands = gestureResult.landmarks || [];
        [0, 1].forEach((i) => {
          const lm = hands[i];
          const handIconEl = handIconRefs.current[i];
          let point = null;
          if (lm) {
            let sx = 0;
            let sy = 0;
            PALM_LANDMARK_INDICES.forEach((idx) => {
              sx += lm[idx].x;
              sy += lm[idx].y;
            });
            point = { x: sx / PALM_LANDMARK_INDICES.length, y: sy / PALM_LANDMARK_INDICES.length };
          }
          positionIcon(handIconEl, point, mapping, smoothedRef.current, `hand${i}`);
          if (point) {
            const top = gestureResult.gestures?.[i]?.[0];
            const label = debounceLabel(
              labelHoldRef.current,
              `hand${i}`,
              pickHandEmoji(top?.categoryName, top?.score ?? 0, lm),
            );
            setIconGlyph(handIconEl, label);
            setIconFlip(handIconEl, updateHandFlip(flipHoldRef.current, `hand${i}`, lm));
          }
        });
      };
      loop();
    } catch (err) {
      if (!mountedRef.current) return;
      stopEverything();
      // Every failure here (camera denied, model load failure) already has
      // its own actionable in-place UI below, re-entered by clicking "Enable
      // camera" again — so it's handled locally, not bubbled via onError.
      // The host Experience page's onError path is permanent/fatal (a
      // "refresh the page" dead end) and would otherwise cover this
      // component's own retry UI as soon as it fires.
      setPhase(err?.name === 'NotAllowedError' ? 'denied' : 'error');
      console.error('MotionOverlayExperience failed to start:', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onReady, stopEverything]);

  const showPrompt = phase !== 'running';

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden rounded-lg bg-black">
      {/* Video + icons are always mounted (never conditionally rendered) so
          videoRef/containerRef are already attached by the time the user
          clicks "Enable camera" — startExperience runs while phase is still
          'requesting', before this ever re-renders past the prompt overlay. */}
      <div className="absolute inset-0" style={{ transform: 'scaleX(-1)' }}>
        <video
          ref={videoRef}
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <IconBadge ref={faceIconRef} defaultIcon={DEFAULT_FACE_EMOJI} />
        <IconBadge ref={(el) => { handIconRefs.current[0] = el; }} defaultIcon={DEFAULT_HAND_EMOJI} />
        <IconBadge ref={(el) => { handIconRefs.current[1] = el; }} defaultIcon={DEFAULT_HAND_EMOJI} />
      </div>

      {phase === 'running' && (
        <p className="absolute bottom-3 inset-x-0 z-10 text-center text-xs text-text-muted px-4 pointer-events-none">
          ✊ ✋ 👍 👎 ✌️ 👆 🤟 👌 🤘 🤙 🖕 gestures · 😄 😮 😉 😠 😢 expressions
        </p>
      )}

      {showPrompt && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 text-center px-6"
          style={{ background: phase === 'loading' ? 'rgba(17,17,17,0.8)' : '#111111' }}
        >
          <div className="text-4xl">🎥</div>
          {phase === 'loading' ? (
            <p className="text-sm text-text-secondary">Loading tracking models…</p>
          ) : phase === 'denied' ? (
            <>
              <p className="text-text-primary font-semibold">Camera access was blocked</p>
              <p className="text-sm text-text-secondary">
                Enable camera permissions for this site in your browser settings, then try again.
              </p>
            </>
          ) : phase === 'error' ? (
            <>
              <p className="text-text-primary font-semibold">Something went wrong</p>
              <p className="text-sm text-text-secondary">
                The tracking models couldn't load. Check your connection and try again.
              </p>
            </>
          ) : (
            <>
              <p className="text-text-primary font-semibold">Enable your camera to start</p>
              <p className="text-sm text-text-secondary max-w-sm">
                Face and hand tracking runs entirely in your browser — nothing is recorded or uploaded.
              </p>
            </>
          )}
          {phase !== 'loading' && (
            <Button onClick={startExperience} disabled={phase === 'requesting'} variant="primary">
              {phase === 'requesting' ? 'Requesting access…' : 'Enable camera'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MotionOverlayExperience;
