import React from "react";
import { Link } from "react-router-dom";



const WorkCard = ({ work }) => {
  const [hovered, setHovered] = React.useState(false);
  const [iconHovered, setIconHovered] = React.useState(false);
  if (!work) return null;
  const imgSrc = work.cover;

  const capitalizeFirst = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  // Determine height class based on importance
  const heightClass = work.important ? "md:h-80" : "h-48"; // Taller for important projects
  // Use inline style for dynamic shadow color
  const shadowStyle = hovered && work.bgColor
    ? { boxShadow: `0 0 900px 100px ${work.bgColor}30` } // 33 is hex for ~0.2 opacity
    : {};
 

  return (
    <Link
      to={`/work/${work.slug}`}
      className="block group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        {...(work.favourite ? { "data-smile-loving": true } : {})}
        className={"relative overflow-hidden border shadow-sm hover:shadow-lg transition outline transition-all hover:outline-4 active:scale-95 bg-white "}
        style={shadowStyle}
      >
        <img
          src={imgSrc}
          alt={`Image of my project ${work.title}`}
          onError={(e) => (e.currentTarget.src = "https://placehold.co/400x300")}
          className={`w-full ${heightClass} h-48 object-cover transition-opacity duration-500 ${hovered && work.videocover ? "opacity-0" : "opacity-100"}`}
        />
        {work.videocover && (
          <video
            src={work.videocover}
            className={`absolute top-0 left-0 w-full ${heightClass} h-48 object-cover transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
            autoPlay
            loop
            muted
            playsInline
          />
        )}
        <div className="absolute bottom-2 right-2 flex flex-row gap-2 items-center">
          <h3 className="bg-white/70 text-black/80 px-2 py-0.5 text-xl font-semibold group-hover:text-black transition-colors h-[2.2em] flex items-center">
            {capitalizeFirst(work.title)}
          </h3>
          {/* Info boxes */}
          {/* First technology: always visible */}
          {work.technologies && work.technologies[0] && (
            <div className="bg-white/80 px-2 py-0.5 flex items-center h-[2.2em] min-w-[2.2em] shadow-sm border border-white/60">
              {(() => {
                const tech = work.technologies[0];
                if (/unity/i.test(tech)) {
                  return (
                    <span title="Unity">
                      <svg width="22" height="22" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M128 16L240 80V176L128 240L16 176V80L128 16Z" fill="#222"/>
                        <path d="M128 32L224 88V168L128 224L32 168V88L128 32Z" fill="#fff"/>
                        <path d="M128 48L208 96V160L128 208L48 160V96L128 48Z" fill="#222"/>
                      </svg>
                    </span>
                  );
                }
                if (/unreal/i.test(tech)) {
                  return (
                    <span title="Unreal Engine">
                      <svg width="22" height="22" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="128" cy="128" r="120" fill="#222" stroke="#fff" strokeWidth="8"/>
                        <text x="50%" y="57%" textAnchor="middle" fill="#fff" fontSize="90" fontFamily="Arial" dy=".3em">U</text>
                      </svg>
                    </span>
                  );
                }
                return (
                  <span className="text-xs text-black/70 font-semibold px-1" title={tech}>{tech}</span>
                );
              })()}
            </div>
          )}
          {/* Second technology: hidden on small, visible md+ */}
          {work.technologies && work.technologies[1] && (
            <div className="hidden md:flex bg-white/80 px-2 py-0.5 items-center h-[2.2em] min-w-[2.2em] shadow-sm border border-white/60">
              {(() => {
                const tech = work.technologies[1];
                if (/unity/i.test(tech)) {
                  return (
                    <span title="Unity">
                      <svg width="22" height="22" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M128 16L240 80V176L128 240L16 176V80L128 16Z" fill="#222"/>
                        <path d="M128 32L224 88V168L128 224L32 168V88L128 32Z" fill="#fff"/>
                        <path d="M128 48L208 96V160L128 208L48 160V96L128 48Z" fill="#222"/>
                      </svg>
                    </span>
                  );
                }
                if (/unreal/i.test(tech)) {
                  return (
                    <span title="Unreal Engine">
                      <svg width="22" height="22" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="128" cy="128" r="120" fill="#222" stroke="#fff" strokeWidth="8"/>
                        <text x="50%" y="57%" textAnchor="middle" fill="#fff" fontSize="90" fontFamily="Arial" dy=".3em">U</text>
                      </svg>
                    </span>
                  );
                }
                return (
                  <span className="text-xs text-black/70 font-semibold px-1" title={tech}>{tech}</span>
                );
              })()}
            </div>
          )}
          {/* Date: only visible on lg+ */}
          {work.date && (
            <div className="hidden lg:flex bg-white/80 px-2 py-0.5 items-center h-[2.2em] min-w-[2.2em] shadow-sm border border-white/60">
              <span className="text-xs text-black/60 font-semibold px-1" title="Date">
                {(() => {
                  const d = new Date(work.date);
                  return d.toLocaleString('default', { month: 'short', year: 'numeric' });
                })()}
              </span>
            </div>
          )}
          {/* Team size: only visible on lg+ */}
          {work.teamSize && (
            <div className="hidden lg:flex bg-white/80 px-2 py-0.5 items-center h-[2.2em] min-w-[2.2em] shadow-sm border border-white/60">
              <span className="flex items-center gap-1 text-xs text-black/60 font-semibold px-1" title="Team size">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="#222" d="M7 20v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2"/><circle cx="12" cy="7" r="4" fill="#222"/></svg>
                {work.teamSize}
              </span>
            </div>
          )}
        </div>
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