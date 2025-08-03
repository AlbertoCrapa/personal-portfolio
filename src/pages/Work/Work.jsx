
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import data from "../../data/data.json";
import Button from "../../components/Button/Button";
import LinkButton from "../../components/Button/LinkButton";
import SplitText from "../../utils/ReactBits/SplitText/SplitText";

const placeholderImage = "https://placehold.co/800x600";

const Work = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const projectList = Object.values(data.projects);
  const currentIndex = projectList.findIndex(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

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
                    textAlign="center"
                />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-8">The project you're looking for doesn't exist.</p>
          
          <div className="space-x-4">
            <Button onClick={() => navigate("/")}>
              &larr; Go Home
            </Button>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const project = projectList[currentIndex];
  const prevIndex = (currentIndex - 1 + projectList.length) % projectList.length;
  const nextIndex = (currentIndex + 1) % projectList.length;

  const images = project?.images?.length
    ? project.images
    : project?.image
      ? [project.image]
      : [];

  const handleImageError = e => (e.currentTarget.src = placeholderImage);


  // Procedural layout composition
  const getLayoutVariant = (idx) => ({
    fullscreen: idx % 3 === 0, // Every 3rd item is fullscreen
    textOnRight: idx % 2 === 0, // Alternate text positioning
  });

  return (
    <div
      {...(project?.favourite ? { "data-smile-loving": true } : {})}
      className="container mx-auto px-4 py-16 ">
      <Button onClick={() => navigate(`/`)}>
        &larr; Back
      </Button>

      <section>
        <h1 className="text-5xl font-bold mb-6 text-center" >{project?.title || 'Untitled Project'}</h1>
        <div>
          <p className="text-gray-800 mb-4">
            <strong>Technologies:</strong> {project?.technologies?.join(", ") || 'Not specified'}
          </p>
          {project?.url && (
            <LinkButton href={project.url} className="mt-8">
              SeeMore
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                xmlns="http://www.w3.org/2000/svg" className="inline-block">
                <path d="M7 13L13 7M13 7H7M13 7V13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </LinkButton>
          )}
        </div>

      </section>


      {/* Responsive Composition with Controller */}
      <div className="flex flex-col gap-12">
        {project?.images && project.images.length > 0 && project?.descriptions && project.descriptions.length > 0 ? (
          project.images.map((media, idx) => {
            const variant = getLayoutVariant(idx);

            if (variant.fullscreen) {
              return (
                <div key={idx} className="w-full">
                  {/* Fullscreen Media */}
                  <div className="w-full mb-8">
                    {media?.endsWith?.(".mp4") || media?.endsWith?.(".webm") ? (
                      <video
                        src={media}
                        controls
                        className=" shadow w-full h-auto max-h-[80vh] object-cover"
                      />
                    ) : (
                      <img
                        src={media}
                        alt={`${project?.title || 'Project'} ${idx + 1}`}
                        onError={handleImageError}
                        className=" shadow w-full h-auto max-h-[80vh] object-cover"
                      />
                    )}
                  </div>
                  {/* Description below fullscreen media */}
                  <div className="max-w-4xl mx-auto">
                    <p className="text-lg text-gray-700 leading-relaxed text-center">
                      {project?.descriptions?.[idx] || ""}
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={idx}
                className={`flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto ${variant.textOnRight ? "" : "md:flex-row-reverse"
                  }`}
              >
                {/* Media */}
                <div className="flex-1 w-full">
                  {media?.endsWith?.(".mp4") || media?.endsWith?.(".webm") ? (
                    <video
                      src={media}
                      controls
                      className=" shadow w-full object-cover max-h-96"
                    />
                  ) : (
                    <img
                      src={media}
                      alt={`${project?.title || 'Project'} ${idx + 1}`}
                      onError={handleImageError}
                      className=" shadow w-full object-cover max-h-96"
                    />
                  )}
                </div>
                {/* Description */}
                <div className="flex-1 w-full">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {project?.descriptions?.[idx] || ""}
                  </p>
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
      <section id="contact" className=" py-0 pt-0   ">
        <p className="w-fit mx-auto bottom-0 pt-8 text-zinc-800 ">
          © 2025 Alberto Crapanzano. All rights reserved.
        </p>
      </section>

    </div>
  );
};

export default Work;