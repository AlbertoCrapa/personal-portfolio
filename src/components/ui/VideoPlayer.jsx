import React, { useState, useRef } from 'react';

/**
 * VideoPlayer Component
 * Video with play/pause indicator at bottom left (matching reference)
 * 
 * @param {string} src - Video source URL
 * @param {string} poster - Poster image URL
 * @param {boolean} autoPlay - Auto play video
 * @param {boolean} loop - Loop video
 * @param {string} className - Additional classes
 */
const VideoPlayer = ({ src, poster, autoPlay = true, loop = true, className = '' }) => {
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const videoRef = useRef(null);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    return (
        <div className={`relative group rounded-lg overflow-hidden ${className}`}>
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                autoPlay={autoPlay}
                loop={loop}
                muted
                playsInline
                onPlay={handlePlay}
                onPause={handlePause}
                className="w-full h-full object-cover"
                onClick={togglePlay}
            />

            {/* Play/Pause Indicator */}
            <button
                onClick={togglePlay}
                className="absolute bottom-3 left-3 flex items-center gap-2 bg-bg/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-text-primary hover:bg-surface transition-colors"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
                <span className="w-3 h-3 flex items-center justify-center">
                    {isPlaying ? (
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
        </div>
    );
};

export default VideoPlayer;
