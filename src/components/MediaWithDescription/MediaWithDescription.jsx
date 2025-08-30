import React from "react";


const MediaWithDescription = ({ mediaObj, size = "small", className = "" }) => {
  if (!mediaObj || !mediaObj.src) return null;
  const isYouTube =
    typeof mediaObj.src === "string" &&
    (mediaObj.src.includes("youtube.com/watch") || mediaObj.src.includes("youtu.be/"));
  const isVideo = mediaObj.src.endsWith(".mp4") || mediaObj.src.endsWith(".webm") || mediaObj.src.endsWith(".mov");
  const maxH = size === "big" ? "max-h-[80vh]" : "max-h-96";

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

  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      {isYouTube ? (
        <div className={`w-full flex justify-center ${maxH}`} style={{ aspectRatio: size === "big" ? "16/9" : "16/9", maxHeight: size === "big" ? "80vh" : "24rem" }}>
          <iframe
            src={getYouTubeEmbedUrl(mediaObj.src)}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded shadow-lg"
            style={{ minHeight: size === "big" ? "320px" : "200px" }}
          />
        </div>
      ) : isVideo ? (
        <video
          src={mediaObj.src}
          autoPlay
          loop
          muted
          className={`shadow-lg bg-zinc-900 w-full h-auto ${maxH} object-contain`}
          onError={e => console.error("Failed to load video:", mediaObj.src)}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={mediaObj.src}
          alt={mediaObj.alt || `media`}
          className={`shadow-lg bg-zinc-900 w-full h-auto ${maxH} object-contain`}
          onError={e => e.currentTarget.src = "https://placehold.co/800x600"}
        />
      )}
      {mediaObj.description && (
        <div className="text-left text-xs text-zinc-500 mt-2 mb-2 w-full">
          {mediaObj.description}
        </div>
      )}
    </div>
  );
};

export default MediaWithDescription;
