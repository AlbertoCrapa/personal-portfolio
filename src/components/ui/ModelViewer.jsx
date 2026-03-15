import React, { useEffect, useRef, useState } from 'react';

const MODEL_VIEWER_SCRIPT_ID = 'model-viewer-script';
const MODEL_VIEWER_SCRIPT_SRC = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';

/**
 * Lightweight 3D model viewer powered by <model-viewer> web component.
 * Supports touch + mouse rotation and works well on mobile.
 */
const ModelViewer = ({ src, poster, alt = '3D model', description, className = '' }) => {
    const modelRef = useRef(null);
    const [isAutoRotating, setIsAutoRotating] = useState(true);
    const [isFastRotation, setIsFastRotation] = useState(false);

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

    useEffect(() => {
        const modelElement = modelRef.current;
        if (!modelElement) return;

        if (isAutoRotating) {
            modelElement.setAttribute('auto-rotate', '');
        } else {
            modelElement.removeAttribute('auto-rotate');
        }
    }, [isAutoRotating]);

    useEffect(() => {
        const modelElement = modelRef.current;
        if (!modelElement) return;

        modelElement.setAttribute('rotation-per-second', isFastRotation ? '40deg' : '20deg');
    }, [isFastRotation]);

    const toggleAutoRotate = () => {
        setIsAutoRotating((prev) => !prev);
    };

    const toggleRotationSpeed = () => {
        setIsFastRotation((prev) => !prev);
    };

    if (!src) return null;

    return (
        <figure className={`rounded-xl overflow-hidden border border-border bg-surface ${className}`}>
            <div className="relative w-full h-full min-h-[260px]">
                <model-viewer
                    ref={modelRef}
                    src={src}
                    poster={poster}
                    alt={alt}
                    camera-controls
                    auto-rotate-delay="100"
                    rotation-per-second="20deg"
                    interaction-prompt="auto"
                    touch-action="pan-y"
                    loading="lazy"
                    style={{ width: '100%', height: '100%', minHeight: '260px', '--poster-color': 'transparent' }}
                />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={toggleAutoRotate}
                        className="flex items-center gap-2 bg-bg/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-text-primary hover:bg-surface transition-colors"
                        aria-label={isAutoRotating ? 'Pause model rotation' : 'Start model rotation'}
                    >
                        <span className="w-3 h-3 flex items-center justify-center">
                            {isAutoRotating ? (
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                    <rect x="6" y="4" width="4" height="16" rx="1" />
                                    <rect x="14" y="4" width="4" height="16" rx="1" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </span>
                        <span className="uppercase tracking-wider font-medium">Model</span>
                    </button>

                    <button
                        type="button"
                        onClick={toggleRotationSpeed}
                        className="flex items-center gap-1.5 bg-bg/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-text-primary hover:bg-surface transition-colors"
                        aria-label={isFastRotation ? 'Set normal rotation speed' : 'Set faster rotation speed'}
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3">
                            <path d="M12 5v14M7 10l5-5 5 5M7 14l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="uppercase tracking-wider font-medium">{isFastRotation ? 'Fast' : 'Normal'}</span>
                    </button>
                </div>
            </div>
            {description && (
                <figcaption className="text-sm text-text-muted px-4 py-3 border-t border-border text-center">
                    {description}
                </figcaption>
            )}
        </figure>
    );
};

export default ModelViewer;
