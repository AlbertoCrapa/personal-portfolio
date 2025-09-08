
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import projectData from "../../data/projects.json";
import Button from "../../components/Button/Button";
import LinkButton from "../../components/Button/LinkButton";
import SplitText from "../../utils/ReactBits/SplitText/SplitText";
import { motion } from "framer-motion";
import RichText from "../../utils/RichText.jsx";
import Footer from "../../components/Footer/Footer";
import MediaWithDescription from "../../components/MediaWithDescription/MediaWithDescription";
import SEO from "../../components/SEO/SEO";
import { useParams, useNavigate } from "react-router-dom";
import projectData from "../../data/projects.json";
import Button from "../../components/Button/Button";
import LinkButton from "../../components/Button/LinkButton";
import SplitText from "../../utils/ReactBits/SplitText/SplitText";
import { motion } from "framer-motion";
import RichText from "../../utils/RichText";
import Footer from "../../components/Footer/Footer";
import MediaWithDescription from "../../components/MediaWithDescription/MediaWithDescription";

const placeholderImage = "https://placehold.co/800x600";

const Work = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const projectList = Object.values(projectData.projects);
  const currentIndex = projectList.findIndex(p => p.slug === slug);


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  // Restore missing variables
  const project = projectList[currentIndex];
  const prevIndex = (currentIndex - 1 + projectList.length) % projectList.length;
  const nextIndex = (currentIndex + 1) % projectList.length;

  const placeholderImage = "https://placehold.co/800x600";
  const handleImageError = (e) => {
    console.error("Failed to load media:", e.currentTarget.src);
    e.currentTarget.src = placeholderImage;
  };
  const getMediaComponent = (mediaObj, idx, isFullscreen = false) => {
    if (!mediaObj) return null;
    const baseClasses = "shadow-lg ";
    const aspectClasses = isFullscreen
      ? "w-full h-auto max-h-[80vh] object-contain"
      : "w-full h-auto max-h-96 object-contain";
    if (mediaObj.src && (mediaObj.src.endsWith(".mp4") || mediaObj.src.endsWith(".webm") || mediaObj.src.endsWith(".mov"))) {
      return (
        <video
          src={mediaObj.src}
          autoPlay
          loop
          muted
          className={`${baseClasses} ${aspectClasses}`}
          onError={(e) => console.error("Failed to load video:", mediaObj.src)}
        >
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <img
          src={mediaObj.src}
          alt={`${project?.title || 'Project'} ${idx + 1}`}
          onError={handleImageError}
          className={`${baseClasses} ${aspectClasses}`}
        />
      );
    }
  };

  if (currentIndex === -1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <SplitText
            text="Oops!"
            className="text-7xl font-extrabold text-gray-400 mb-4"
            delay={100}
            duration={0.5}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-8">The project you're looking for doesn't exist.</p>
          <div className="space-x-4">
            <Button onClick={() => navigate("/")}> &larr; Go Home </Button>
            <Button onClick={() => window.history.back()}> Go Back </Button>
          </div>
        </div>
      </div>
    );
  }


  // Procedural layout composition
  const getLayoutVariant = (idx) => ({
    fullscreen: idx % 3 === 0, // Every 3rd item is fullscreen
    textOnRight: idx % 2 === 0, // Alternate text positioning
  });

  return (
    <>
      <SEO 
        title={`${project?.title || 'Project'} - Alberto Crapanzano`}
        description={project?.content?.[0]?.text?.substring(0, 160) || `${project?.title || 'Project'} by Alberto Crapanzano - Game Technical Designer & Creative Developer`}
        keywords={`${project?.title}, ${project?.technologies?.join(', ') || ''}, Alberto Crapanzano, Game Development, ${project?.type || ''}`}
        url={`/work/${slug}`}
        image={project?.cover ? `https://albyeah.com${project.cover}` : "https://albyeah.com/img/profile.jpg"}
        type="article"
      />
      <motion.div
        {...(project?.favourite ? { "data-smile-loving": true } : {})}
        className="container mx-auto px-4 md:py-16 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
      >
        <Button className={"md:mb-0 mb-8"} onClick={() => navigate(`/`)}>
          &larr; Back
        </Button>
      </motion.div>


      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.2, ease: "easeOut" }}
        className="mb-10"
      >
        <h1 className="text-5xl font-extrabold mb-4 text-center tracking-tight" >{project?.title || 'Untitled Project'}</h1>
        {/* Info Row */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-8">
          {/* Type icon */}
          {project?.type && (
            <span className="bg-white/90 border border-zinc-200 px-3 py-1 flex items-center gap-2 shadow-sm">
              <img
                src={process.env.PUBLIC_URL + `/img/worktype-icons/${project.type}.svg`}
                alt={project.type + ' icon'}
                className="w-7 h-7 object-contain"
              />
              <span className="text-base font-semibold text-zinc-700 capitalize">{project.type}</span>
            </span>
          )}
          {/* Technologies (all) */}
          {project?.technologies && project.technologies.length > 0 ? (
            project.technologies.map((tech, i) => (
              <span key={tech + i} className="bg-white/90 border border-zinc-200 px-3 py-1 flex items-center gap-2 shadow-sm">
                {/unity/i.test(tech) ? (
                  <img src={process.env.PUBLIC_URL + "/img/icons/unityengine.png"} alt="Unity icon" className="w-7 h-7 object-contain" />
                ) : /unreal/i.test(tech) ? (
                  <img src={process.env.PUBLIC_URL + "/img/icons/unrealengine.png"} alt="Unreal Engine icon" className="w-7 h-7 object-contain" />
                ) : null}
                <span className="text-base font-semibold text-zinc-700 capitalize">{tech}</span>
              </span>
            ))
          ) : (
            <span className="bg-white/90 border border-zinc-200 px-3 py-1 flex items-center gap-2 shadow-sm text-zinc-400">No technologies specified</span>
          )}
          {/* Team size */}
          {project?.teamSize ? (
            <span className="bg-white/90 border border-zinc-200 px-3 py-1 flex items-center gap-2 shadow-sm">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#222" d="M7 20v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2" /><circle cx="12" cy="7" r="4" fill="#222" /></svg>
              <span className="text-base font-semibold text-zinc-700">{project.teamSize}</span>
            </span>
          ) : (
            <span className="bg-white/90 border border-zinc-200 px-3 py-1 flex items-center gap-2 shadow-sm text-zinc-400">No team size</span>
          )}
          {/* Date */}
          {project?.date && (
            <span className="bg-white/90 border border-zinc-200 px-3 py-1 flex items-center gap-2 shadow-sm">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#888" strokeWidth="2" /><path d="M8 12h4V8" stroke="#888" strokeWidth="2" strokeLinecap="round" /></svg>
              <span className="text-base font-semibold text-zinc-700">{(() => { const d = new Date(project.date); return d.toLocaleString('default', { month: 'short', year: 'numeric' }); })()}</span>
            </span>
          )}
          {/* Open Link Button */}
          {project?.url && (
            <LinkButton href={project.url} className="ml-2">
              Open Project
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                xmlns="http://www.w3.org/2000/svg" className="inline-block">
                <path d="M7 13L13 7M13 7H7M13 7V13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </LinkButton>
          )}
        </div>
      </motion.section>


      {/* Responsive Composition with Controller */}
      <div className="flex flex-col gap-12">
        {project?.content && project.content.length > 0 ? (
          project.content.map((section, idx) => {
            const mediaObj = (project.media && project.media.length > idx) ? project.media[idx] : {};
            const variant = getLayoutVariant(idx);
            const size = variant.fullscreen ? "big" : "small";
            if (variant.fullscreen) {
              return (
                <div key={idx} className="w-full">
                  <div className="w-full mb-2 flex justify-center">
                    <MediaWithDescription mediaObj={mediaObj} size="big" />
                  </div>
                  <div className="max-w-4xl mx-auto">
                    {section.title && <h3 className="text-2xl font-bold mb-2">{section.title}</h3>}
                    <RichText text={section.text || ""} />
                  </div>
                </div>
              );
            }
            // If no media, make text full width
            const hasMedia = mediaObj && mediaObj.src;
            if (!hasMedia) {
              return (
                <div key={idx} className="w-full max-w-4xl mx-auto">
                  {section.title && <h3 className="text-2xl font-bold mb-2">{section.title}</h3>}
                  <RichText text={section.text || ""} />
                </div>
              );
            }
            // Default: media + text side by side
            return (
              <div
                key={idx}
                className={`flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto ${variant.textOnRight ? "" : "md:flex-row-reverse"}`}
              >
                <div className="flex-1 w-full flex flex-col items-center">
                  <MediaWithDescription mediaObj={mediaObj} size="small" />
                </div>
                <div className="flex-1 w-full pb-10">
                  {section.title && <h3 className="text-2xl font-bold mb-2">{section.title}</h3>}
                  <RichText text={section.text || ""} />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-600">
            <p>No media or descriptions available.</p>
          </div>
        )}
      </div>



      <div className="mt-16 flex justify-between">
        <Button onClick={() => navigate(`/work/${projectList[prevIndex]?.slug}`)}>
          Previous
        </Button>
        <Button onClick={() => navigate(`/work/${projectList[nextIndex]?.slug}`)}>
          Next
        </Button>
      </div>
      {/* <Footer contact={data.contact} showMailCTA={false} /> */}
      <section id="contact" className=" py-0 pt-0   ">
        <p className="w-fit mx-auto bottom-0 pt-8 text-zinc-800 ">
          © 2025 Alberto Crapanzano. All rights reserved.
        </p>
      </section>




    </motion.div>
    </>
  );
};

export default Work;