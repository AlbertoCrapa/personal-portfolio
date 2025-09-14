import React, { useState, useEffect } from "react";


const MediaWithDescription = ({ mediaObj, size = "small", className = "" }) => {
  // All hooks must be at the top level
  const [hovered, setHovered] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Prevent scrolling when fullscreen
  useEffect(() => {
    if (fullscreen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = original; };
    }
  }, [fullscreen]);

  // If no media, still render description (and allow parent to render title/text)
  if (!mediaObj || !mediaObj.src) {
    return (
      <div className={`w-full flex flex-col items-center ${className}`}>
        {mediaObj && mediaObj.description && (
          <div className="text-left text-xs text-zinc-500 mt-2 mb-2 w-full">
            {mediaObj.description}
          </div>
        )}
      </div>
    );
  }
  const isYouTube =
    typeof mediaObj.src === "string" &&
    (mediaObj.src.includes("youtube.com/watch") || mediaObj.src.includes("youtu.be/"));
  const isVideo = mediaObj.src.endsWith(".mp4") || mediaObj.src.endsWith(".webm") || mediaObj.src.endsWith(".mov");

  // Helper to get YouTube embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (url.includes("youtube.com/watch")) {
      const v = url.split("v=")[1]?.split("&")[0];
      return v ? `https://www.youtube.com/embed/${v}` : url;
    }
    if (url.includes("youtu.be/")) {
      const v = url.split("youtu.be/")[1]?.split("?")[0];
      return v ? `https://www.youtube.com/embed/${v}` : url;
    }
    return url;
  };

  // Aspect ratio and min height for all media
  const aspectRatio = "16/9";
  const minHeight = size === "big" ? "320px" : "200px";
  const maxHeight = size === "big" ? "80vh" : "24rem";

  return (
    <>
      <div className={`w-full flex flex-col  items-center ${className}`}>
        <div
          className={`w-full flex justify-center items-center bg-zinc-900 rounded shadow-lg relative group rounded-[26px] rounded-bl-none overflow-hidden `}
          style={{ aspectRatio, minHeight, maxHeight, position: "relative" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Loading spinner overlay */}
          {loading && (
            <span className="absolute z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="animate-spin" width="32" height="32" viewBox="0 0 24 24" style={{opacity:0.5}} fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="4" opacity="0.2" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          )}
          {/* Fullscreen icon (not for YouTube, and not if disablezoom) */}
          {!isYouTube && hovered && !mediaObj.disablezoom && (
            <button
              className="absolute left-3 bottom-3 z-20 bg-white opacity-60 hover:opacity-100 text-zinc-800 rounded-full p-2 shadow-lg transition-all"
              style={{ border: "none", outline: "none", cursor: "pointer" }}
              onClick={() => setFullscreen(true)}
              tabIndex={-1}
              aria-label="Open fullscreen"
              data-cursor-text="Fullscreen"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m0 8v3a2 2 0 0 0 2 2h3m8-18h3a2 2 0 0 1 2 2v3m0 8v3a2 2 0 0 1-2 2h-3"/></svg>
            </button>
          )}
          {isYouTube ? (
            <iframe
              src={getYouTubeEmbedUrl(mediaObj.src)}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded"
              style={{ minHeight, background: "#222" }}
              onLoad={() => setLoading(false)}
            />
          ) : isVideo ? (
            <video
              src={mediaObj.src}
              autoPlay
              loop
              muted
              playsInline
              className={`w-full h-full object-cover `}
              style={{ minHeight, background: "#222" }}
              onLoadedData={() => setLoading(false)}
              onError={e => { setLoading(false); setError(true); e.currentTarget.style.background = "#222"; }}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={mediaObj.src}
              alt={mediaObj.alt || `media`}
              className={`w-full h-full object-cover `}
              style={{ minHeight, background: "#222" }}
              onLoad={() => setLoading(false)}
              onError={e => { setLoading(false); setError(true); e.currentTarget.src = "https://placehold.co/800x600"; e.currentTarget.style.background = "#222"; }}
            />
          )}
        </div>
        {mediaObj.description && (
          <div className="text-left text-xs text-zinc-500 mt-2 mb-2 w-full ">
            {mediaObj.description}
          </div>
        )}
      </div>
      {/* Fullscreen Modal */}
      {fullscreen && !isYouTube && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center  animate-fade-in "
          style={{ backdropFilter: "blur(2px)", position: "fixed", backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          {/* Close button with highest z-index and pointer-events */}
          <button
            className="absolute top-6 right-8 z-[100] bg-white opacity-60 hover:opacity-100  text-zinc-900 rounded-full p-2 shadow-lg text-2xl"
            style={{ border: "none", outline: "none", cursor: "pointer", zIndex: 100, pointerEvents: "auto" }}
            onClick={() => setFullscreen(false)}
            aria-label="Close fullscreen"
            data-cursor-text="Close"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div className="w-full flex justify-center items-center" style={{ minHeight: 0, minWidth: 0, height: "100vh", width: "100vw", maxWidth: "100vw", maxHeight: "100vh", padding: 0, position: "relative", zIndex: 10 }}>
            {isVideo ? (
              <video
                src={mediaObj.src}
                autoPlay
                loop
                muted
                playsInline
                controls
                className="object-contain rounded "
                style={{ background: "#222", maxHeight: "98vh", maxWidth: "98vw", width: "auto", height: "auto", display: "block", margin: "auto", zIndex: 10 }}
              />
            ) : (
              <img
                src={mediaObj.src}
                alt={mediaObj.alt || `media`}
                className="object-contain rounded "
                style={{ background: "#222", maxHeight: "98vh", maxWidth: "98vw", width: "auto", height: "auto", display: "block", margin: "auto", zIndex: 10 }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MediaWithDescription;
