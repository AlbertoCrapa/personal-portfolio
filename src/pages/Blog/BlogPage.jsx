import React, { useEffect } from "react";
import data from "../../data/blog.json";
import { useParams, useNavigate } from "react-router-dom";

import Button from "../../components/Button/Button";
import Footer from "../../components/Footer/Footer";
import dataMain from "../../data/data.json";
import MediaWithDescription from "../../components/MediaWithDescription/MediaWithDescription";
import RichText from "../../utils/RichText";
import SEO from "../../components/SEO/SEO";

const BlogPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const blogList = data.blogs;
  const currentIndex = blogList.findIndex((b) => b.slug === slug);
  const blog = blogList[currentIndex];
  const prevIndex = (currentIndex - 1 + blogList.length) % blogList.length;
  const nextIndex = (currentIndex + 1) % blogList.length;

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4">
        <h1 className="text-5xl font-extrabold text-gray-dark mb-4">Oops!</h1>
        <h2 className="text-2xl font-bold text-black mb-2">Blog Not Found</h2>
        <p className="text-gray-dark mb-8">The blog post you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/blog")}> &larr; Back to Blog </Button>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${blog.title} - Alberto Crapanzano Blog`}
        description={blog.excerpt || blog.content?.[0]?.text?.substring(0, 160) || `${blog.title} by Alberto Crapanzano - Game Technical Designer & Creative Developer`}
        keywords={`${blog.title}, ${blog.tags?.join(', ') || ''}, Alberto Crapanzano, Game Development, Blog`}
        url={`/blog/${slug}`}
        image={blog.media?.[0]?.src ? `https://albyeah.com${blog.media[0].src}` : "https://albyeah.com/img/profile.jpg"}
        type="article"
      />
      <div className="container mx-auto px-4 md:py-16 py-8 bg-bg">
        <div className="mb-6">
          <Button onClick={() => navigate("/blog")}> &larr; Back to Blog </Button>
        </div>
        {blog.media && blog.media.length > 0 && blog.media[0].src ? (
          <img src={blog.media[0].src} alt={blog.title} className="w-full h-72 object-cover rounded-3xl rounded-bl-none mb-8" />
        ) : null}
        <h1 className="md:text-5xl text-3xl font-extrabold mb-2 tracking-tight text-black">{blog.title}</h1>
        <p className="text-gray-dark text-sm mb-4">{new Date(blog.date).toLocaleString('default', { month: 'short', year: 'numeric' })} &middot; {blog.author}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.map((tag) => (
            <span key={tag} className="bg-white text-gray-dark px-2 py-0.5 rounded-xl rounded-bl-none text-xs font-semibold">{tag}</span>
          ))}
        </div>
        {blog.content && blog.content.length > 0 ? (
          <div className="flex flex-col gap-12">
            {blog.content.map((section, idx) => {
              const mediaObj = (blog.media && blog.media.length > idx) ? blog.media[idx] : {};
              const fullscreen = idx % 3 === 0;
              const textOnRight = idx % 2 === 0;
              if (fullscreen) {
                return (
                  <div key={idx} className={`w-full`}>
                    <div className="w-full mb-2 flex justify-center">
                      <MediaWithDescription mediaObj={idx === 1 && mediaObj} size="big" />
                    </div>
                    <div className="max-w-5xl mx-auto">
                      {section.title && <h3 className="text-2xl font-bold mb-2">{section.title}</h3>}
                      <RichText text={section.text || ""} />
                    </div>
                  </div>
                );
              }
              const hasMedia = mediaObj && mediaObj.src;
              if (!hasMedia) {
                return (
                  <div key={idx} className="w-full max-w-5xl mx-auto">
                    {section.title && <h3 className="text-2xl font-bold mb-2">{section.title}</h3>}
                    <RichText text={section.text || ""} />
                  </div>
                );
              }
              return (
                <div
                  key={idx}
                  className={`flex flex-col md:flex-row items-center gap-8 max-w-5xl mx-auto ${textOnRight ? "" : "md:flex-row-reverse"}`}
                >
                  <div className="flex-1 w-full flex flex-col items-center">
                    <MediaWithDescription mediaObj={mediaObj} size="small" />
                  </div>
                  <div className="flex-1 w-full">
                    {section.title && <h3 className="text-2xl font-bold mb-2">{section.title}</h3>}
                    <RichText text={section.text || ""} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="prose prose-zinc max-w-none mb-8">
            {blog.content.map((section, i) => (
              <div key={i}>
                {section.title && <h3 className="text-2xl font-bold mb-2">{section.title}</h3>}
                <RichText text={section.text || section} />
              </div>
            ))}
          </div>
        )}
        <div className="mt-16 flex justify-between">
          <Button onClick={() => navigate(`/blog/${blogList[prevIndex].slug}`)}>
            Previous
          </Button>
          <Button onClick={() => navigate(`/blog/${blogList[nextIndex].slug}`)}>
            Next
          </Button>
        </div>
      </div>
      <Footer contact={dataMain.contact} showMailCTA={false} />
    </>
  );
};

export default BlogPage;
