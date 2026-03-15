import React, { useEffect } from 'react';

const MODEL_VIEWER_SCRIPT_ID = 'model-viewer-script';
const MODEL_VIEWER_SCRIPT_SRC = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';

/**
 * Lightweight 3D model viewer powered by <model-viewer> web component.
 * Supports touch + mouse rotation and works well on mobile.
 */
const ModelViewer = ({ src, poster, alt = '3D model', description, className = '' }) => {
    useEffect(() => {
        if (typeof window === 'undefined' || typeof document === 'undefined') return;

        if (window.customElements?.get('model-viewer')) return;

        if (document.getElementById(MODEL_VIEWER_SCRIPT_ID)) return;

        const script = document.createElement('script');
        script.id = MODEL_VIEWER_SCRIPT_ID;
        script.type = 'module';
        script.src = MODEL_VIEWER_SCRIPT_SRC;
        document.body.appendChild(script);
    }, []);

    if (!src) return null;

    return (
        <figure className={`rounded-xl overflow-hidden border border-border bg-surface ${className}`}>
            <model-viewer
                src={src}
                poster={poster}
                alt={alt}
                camera-controls
                auto-rotate
                auto-rotate-delay="100"
                rotation-per-second="20deg"
                interaction-prompt="auto"
                touch-action="pan-y"
                loading="lazy"
                style={{ width: '100%', height: '100%', minHeight: '260px', '--poster-color': 'transparent' }}
            />
            {description && (
                <figcaption className="text-sm text-text-muted px-4 py-3 border-t border-border text-center">
                    {description}
                </figcaption>
            )}
        </figure>
    );
};

export default ModelViewer;
