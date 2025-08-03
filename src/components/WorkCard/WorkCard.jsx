import React from "react";
import { Link } from "react-router-dom";



const WorkCard = ({ work }) => {
  const [hovered, setHovered] = React.useState(false);
  const [iconHovered, setIconHovered] = React.useState(false);
  if (!work) return null;
  const imgSrc = work.cover;

  const capitalizeFirst = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

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
          alt={`Image of my project ${work.title}`}
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
          {capitalizeFirst(work.title)}
        </h3>
        <div className="absolute top-2 left-2 bg-white/70 text-black/80 px-2 py-0.5 text-sm font-semibold group-hover:text-black transition-colors">
          {work.type && (
            <>
              <img
                src={process.env.PUBLIC_URL + `/img/worktype-icons/${work.type}.svg`}
                alt={`${capitalizeFirst(work.title)} icon`}
                className="inline-block w-7 h-7 m align-middle"
                onMouseEnter={() => setIconHovered(true)}
                onMouseLeave={() => setIconHovered(false)}
              />
              {iconHovered && (
                <div className="absolute  origin-left left-14  top-14 inset-0 flex items-center text-left justify-center pointer-events-none">
                  <div className="bg-white/70 min-w-[110px] max-w-[111px] shadow-lg px-[13.6px] py-1 text-black text-base font-semibold animate-fade-in">
                   {capitalizeFirst(work.type)}
                  </div>
                </div>
              )}
            </>

          )}
        </div>


      </div>
    </Link>
  );
};

export default WorkCard;