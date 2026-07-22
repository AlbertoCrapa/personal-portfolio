import React, { useEffect, useRef } from 'react';

const SCRIPT_SRC = '/experiences/ai-demo/ai-demo.js';
const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 768;

// The glue script is a classic (non-module) <script> that defines a single
// global factory, `createAiDemoModule`. Loaded once and cached; each mount
// of this component calls the factory again to get a fresh, isolated wasm
// instance (its own memory + SDL/GL state) rather than sharing one globally.
let scriptLoadPromise = null;
function loadAiDemoScript() {
  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise((resolve, reject) => {
    if (window.createAiDemoModule) {
      resolve(window.createAiDemoModule);
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => {
      if (window.createAiDemoModule) resolve(window.createAiDemoModule);
      else reject(new Error('ai-demo.js loaded but did not define createAiDemoModule'));
    };
    script.onerror = () => reject(new Error('Failed to load ai-demo.js'));
    document.body.appendChild(script);
  }).catch((err) => {
    scriptLoadPromise = null; // allow a retry on the next mount
    throw err;
  });

  return scriptLoadPromise;
}

/**
 * AiDemoExperience — hosts the "Enemy AI Prototype" WebAssembly build.
 * Loads the Emscripten glue script on demand, instantiates it against a
 * canvas sized to the app's native 1024x768 resolution (scaled responsively
 * via CSS), and tears the simulation down cleanly on unmount.
 */
const AiDemoExperience = ({ onReady, onError }) => {
  const canvasRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    loadAiDemoScript()
      .then((createAiDemoModule) =>
        createAiDemoModule({
          canvas: canvasRef.current,
          print: () => {},
          printErr: () => {},
        }),
      )
      .then((instance) => {
        if (cancelled) {
          try {
            instance.ccall('emscripten_cancel_main_loop', null, [], []);
          } catch {
            // Instance may not have reached the main loop yet; nothing to cancel.
          }
          return;
        }
        instanceRef.current = instance;
        onReady?.();
      })
      .catch((err) => {
        if (!cancelled) onError?.(err);
      });

    return () => {
      cancelled = true;
      const instance = instanceRef.current;
      if (instance) {
        try {
          instance.ccall('emscripten_cancel_main_loop', null, [], []);
        } catch {
          // Best-effort: the module may already have torn itself down.
        }
      }
      instanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="max-w-full max-h-full w-auto h-auto rounded-lg shadow-2xl"
      style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
    />
  );
};

export default AiDemoExperience;
