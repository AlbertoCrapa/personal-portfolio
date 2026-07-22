import { lazy } from 'react';

/**
 * Registry mapping a playground item's `experience.kind` (see
 * src/data/playground.json) to the component that renders it inside the
 * dedicated /playground/:slug/play page. Each entry is lazy-loaded so an
 * experience's dependencies (wasm glue, @mediapipe/tasks-vision, ...) only
 * ever load when that specific experience is opened.
 */
const EXPERIENCES = {
  'wasm-canvas': lazy(() => import('./AiDemoExperience')),
  'webcam-overlay': lazy(() => import('./MotionOverlayExperience')),
};

export function getExperienceComponent(kind) {
  return EXPERIENCES[kind] || null;
}

export default EXPERIENCES;
