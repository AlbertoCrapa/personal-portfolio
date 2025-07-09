import React from "react";
import { Link } from "react-router-dom";



const WorkCard = ({ work }) => {
  const [hovered, setHovered] = React.useState(false);
  if (!work) return null;
  const imgSrc = work.cover;
 

  

  return (
    <Link
      to={`/work/${work.slug}`}
      className="block group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        {...(work.favourite ? { "data-smile-loving": true } : {})}
        className="relative overflow-hidden border shadow-sm hover:shadow-lg transition outline transition-all hover:outline-4 active:scale-95 "
      >
        <img
          src={imgSrc}
          alt={work.title}
          onError={(e) => (e.currentTarget.src = "https://placehold.co/400x300")}
          className={`w-full h-48 object-cover transition-opacity duration-500 ${hovered && work.videocover ? "opacity-0" : "opacity-100"}`}
        />
        {work.videocover && (
          <video
            src={work.videocover}
            className={`absolute top-0 left-0 w-full h-48 object-cover transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
            autoPlay
            loop
            muted
            playsInline
          />
        )}
        <h3 className="absolute bottom-2 right-2 bg-white/70 text-black/80 px-2 py-0.5 text-xl font-semibold group-hover:text-black transition-colors">
          {work.title}
        </h3>
      </div>
    </Link>
  );
};

export default WorkCard;