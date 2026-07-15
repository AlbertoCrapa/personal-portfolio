import React, { useState, useRef, useEffect } from 'react';

/**
 * VideoPlayer Component
 * Video with play/pause indicator at bottom left (matching reference)
 *
 * @param {string} src - Video source URL
 * @param {string} poster - Poster image URL
 * @param {boolean} autoPlay - Auto play video
 * @param {boolean} loop - Loop video
 * @param {string} className - Additional classes
 * @param {function} onReady - Called once the video has enough data to play
 * @param {React.ReactNode} children - Optional overlay slot (e.g. a fullscreen button)
 */
const VideoPlayer = ({ src, poster, autoPlay = true, loop = true, className = '', onReady, children, pauseOffscreen = true }) => {
    // "Managed" videos are driven by the viewport observer (play in view, pause
    // when they leave). Banners pass pauseOffscreen={false} to keep playing
    // always via the native autoPlay attribute.
    const managed = autoPlay && pauseOffscreen;
    const [isPlaying, setIsPlaying] = useState(autoPlay && !pauseOffscreen);
    const [isLoading, setIsLoading] = useState(true);
    const videoRef = useRef(null);
    const wrapperRef = useRef(null);
    const pausedByUser = useRef(false);

    const hasExplicitHeight = /(^|\s)(h-|min-h-|max-h-|aspect-)/.test(className);

    const safePlay = () => {
        const v = videoRef.current;
        if (!v) return;
        const p = v.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
    };

    // Play only while on screen; pause (and, with preload="metadata", avoid
    // fetching the full file) once the video leaves the viewport. Follows the
    // element into fullscreen too, since it's visible there.
    useEffect(() => {
        if (!managed || typeof IntersectionObserver === 'undefined') return;
        const el = wrapperRef.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!videoRef.current) return;
                if (entry.isIntersecting) {
                    if (!pausedByUser.current) safePlay();
                } else {
                    videoRef.current.pause();
                }
            },
            { threshold: 0.25 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [managed]);

    const togglePlay = () => {
        if (isLoading) return;
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                pausedByUser.current = true;
            } else {
                safePlay();
                pausedByUser.current = false;
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const markReady = () => {
        setIsLoading(false);
        if (onReady) onReady();
    };
    const handleWaiting = () => setIsLoading(true);

    return (
        <div ref={wrapperRef} className={`relative group rounded-lg overflow-hidden bg-surface ${hasExplicitHeight ? '' : 'aspect-video'} ${className}`}>
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                autoPlay={autoPlay && !pauseOffscreen}
                loop={loop}
                muted
                playsInline
                preload={pauseOffscreen ? 'metadata' : 'auto'}
                onPlay={handlePlay}
                onPause={handlePause}
                onLoadedData={markReady}
                onCanPlay={markReady}
                onWaiting={handleWaiting}
                className="w-full h-full object-cover"
                onClick={togglePlay}
            />

            {/* Play/Pause Indicator */}
            <button
                onClick={togglePlay}
                className="absolute bottom-3 left-3 z-10 flex items-center gap-2 bg-bg/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-text-primary hover:bg-surface transition-colors"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
                <span className="w-3 h-3 flex items-center justify-center">
                    {isLoading ? (
                        <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 animate-spin">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                            <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    ) : isPlaying ? (
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
                <span className="uppercase tracking-wider font-medium">Video</span>
            </button>

            {/* Optional overlay slot (e.g. fullscreen button from MediaFrame) */}
            {children}
        </div>
    );
};

export default VideoPlayer;
