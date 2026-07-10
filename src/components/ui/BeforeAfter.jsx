import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * BeforeAfter — image comparison slider with a draggable center handle.
 *
 * Props:
 *   before      { src, alt }  image shown on the left / clipped side
 *   after       { src, alt }  image shown on the right / base side
 *   description  optional caption
 *   startAt      initial handle position (0-100), default 50
 */
const BeforeAfter = ({ before, after, description, startAt = 50 }) => {
    const containerRef = useRef(null);
    const draggingRef = useRef(false);
    const [position, setPosition] = useState(startAt);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        const el = containerRef.current;
        if (!el || typeof ResizeObserver === 'undefined') return;
        const ro = new ResizeObserver(([entry]) => {
            setContainerWidth(entry.contentRect.width);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const updateFromClientX = useCallback((clientX) => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const pct = ((clientX - rect.left) / rect.width) * 100;
        setPosition(Math.min(100, Math.max(0, pct)));
    }, []);

    const stopDragging = useCallback(() => {
        draggingRef.current = false;
    }, []);

    useEffect(() => {
        const onMove = (e) => {
            if (!draggingRef.current) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updateFromClientX(clientX);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('mouseup', stopDragging);
        window.addEventListener('touchend', stopDragging);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('mouseup', stopDragging);
            window.removeEventListener('touchend', stopDragging);
        };
    }, [updateFromClientX, stopDragging]);

    const startDragging = (e) => {
        draggingRef.current = true;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        updateFromClientX(clientX);
    };

    const onKeyDown = (e) => {
        if (e.key === 'ArrowLeft') setPosition((p) => Math.max(0, p - 2));
        if (e.key === 'ArrowRight') setPosition((p) => Math.min(100, p + 2));
    };

    return (
        <figure className="space-y-1">
            <div
                ref={containerRef}
                className="relative w-full overflow-hidden rounded-xl select-none cursor-ew-resize"
                onMouseDown={startDragging}
                onTouchStart={startDragging}
            >
                {/* After (base image, sets the aspect ratio) */}
                <img
                    src={after?.src}
                    alt={after?.alt || 'After'}
                    className="block w-full h-auto pointer-events-none"
                    draggable={false}
                    onError={(e) => { e.target.src = 'https://placehold.co/800x600'; }}
                />

                {/* Before (clipped to the left of the handle) */}
                <div
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    style={{ width: `${position}%` }}
                >
                    <img
                        src={before?.src}
                        alt={before?.alt || 'Before'}
                        className="block h-full max-w-none pointer-events-none object-cover"
                        draggable={false}
                        style={{ width: containerWidth ? `${containerWidth}px` : '100%' }}
                        onError={(e) => { e.target.src = 'https://placehold.co/800x600'; }}
                    />
                    <span className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-white">
                        Before
                    </span>
                </div>

                {/* After label (clipped to the right of the handle — mirror of Before) */}
                <div
                    className="absolute inset-y-0 right-0 overflow-hidden pointer-events-none"
                    style={{ width: `${100 - position}%` }}
                >
                    <span className="absolute top-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-white">
                        After
                    </span>
                </div>

                {/* Handle */}
                <div
                    className="absolute top-0 bottom-0 flex items-center justify-center"
                    style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                >
                    <div className="absolute top-0 bottom-0 w-0.5 bg-white/90" />
                    <button
                        type="button"
                        aria-label="Drag to compare"
                        onKeyDown={onKeyDown}
                        onMouseDown={startDragging}
                        onTouchStart={startDragging}
                        className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-lg cursor-ew-resize"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="9 7 4 12 9 17" />
                            <polyline points="15 7 20 12 15 17" />
                        </svg>
                    </button>
                </div>
            </div>
            {description && (
                <figcaption className="text-sm text-text-muted text-center">
                    {description}
                </figcaption>
            )}
        </figure>
    );
};

export default BeforeAfter;
