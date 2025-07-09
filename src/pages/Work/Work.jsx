
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import data from "../../data/data.json";
import Button from "../../components/Button/Button";

const placeholderImage = "https://placehold.co/800x600";

const Work = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const projectList = Object.values(data.projects);
  const currentIndex = projectList.findIndex(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  


  const project = projectList[currentIndex];
  const prevIndex = (currentIndex - 1 + projectList.length) % projectList.length;
  const nextIndex = (currentIndex + 1) % projectList.length;

  const images = project.images?.length
    ? project.images
    : project.image
      ? [project.image]
      : [];

  const handleImageError = e => (e.currentTarget.src = placeholderImage);


  // Procedural layout composition
  const getLayoutVariant = (idx) => ({
    fullscreen: idx % 3 === 0, // Every 3rd item is fullscreen
    textOnRight: idx % 2 === 0, // Alternate text positioning
  });
  
  if (currentIndex === -1) {
    return (
      <div className="py-16 text-center text-xl text-gray-600">
        Project not found.
      </div>
    );
  }


  return (
    <div 
      {...(project.favourite ? { "data-smile-loving": true } : {})}
      className="container mx-auto px-4 py-16 ">
      <Button onClick={() => navigate(`/`)}>
        &larr; Back
      </Button>

      <h1 className="text-5xl font-bold mb-6 text-center" >{project.title}</h1>

      {/* Responsive Composition with Controller */}
      <div className="flex flex-col gap-12">
        {project.images && project.images.length > 0 && project.descriptions && project.descriptions.length > 0 ? (
          project.images.map((media, idx) => {
            const variant = getLayoutVariant(idx);
            
            if (variant.fullscreen) {
              return (
                <div key={idx} className="w-full">
                  {/* Fullscreen Media */}
                  <div className="w-full mb-8">
                    {media.endsWith(".mp4") || media.endsWith(".webm") ? (
                      <video
                        src={media}
                        controls
                        className="rounded-lg shadow w-full h-auto max-h-[80vh] object-cover"
                      />
                    ) : (
                      <img
                        src={media}
                        alt={`${project.title} ${idx + 1}`}
                        onError={handleImageError}
                        className="rounded-lg shadow w-full h-auto max-h-[80vh] object-cover"
                      />
                    )}
                  </div>
                  {/* Description below fullscreen media */}
                  <div className="max-w-4xl mx-auto">
                    <p className="text-lg text-gray-700 leading-relaxed text-center">
                      {project.descriptions[idx] || ""}
                    </p>
                  </div>
                </div>
              );
            }
            
            return (
              <div
                key={idx}
                className={`flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto ${
                  variant.textOnRight ? "" : "md:flex-row-reverse"
                }`}
              >
                {/* Media */}
                <div className="flex-1 w-full">
                  {media.endsWith(".mp4") || media.endsWith(".webm") ? (
                    <video
                      src={media}
                      controls
                      className="rounded-lg shadow w-full object-cover max-h-96"
                    />
                  ) : (
                    <img
                      src={media}
                      alt={`${project.title} ${idx + 1}`}
                      onError={handleImageError}
                      className="rounded-lg shadow w-full object-cover max-h-96"
                    />
                  )}
                </div>
                {/* Description */}
                <div className="flex-1 w-full">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {project.descriptions[idx] || ""}
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

      <div className="mt-12 text-center">
        <p className="text-gray-800 mb-4">
          <strong>Technologies:</strong> {project.technologies?.join(", ")}
        </p>
        {project.url && (
          <a
            href={project.url}
            className="text-blue-600 hover:underline text-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        )}
      </div>

      <div className="mt-16 flex justify-between">
        <Button onClick={() => navigate(`/work/${projectList[prevIndex].slug}`)}>
          Previous
        </Button>
        <Button onClick={() => navigate(`/work/${projectList[nextIndex].slug}`)}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default Work;