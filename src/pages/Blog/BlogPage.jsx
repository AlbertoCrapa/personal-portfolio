import React from "react";
import data from "../../data/blog.json";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";

const BlogPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const blogList = data.blogs;
  const currentIndex = blogList.findIndex((b) => b.slug === slug);
  const blog = blogList[currentIndex];
  const prevIndex = (currentIndex - 1 + blogList.length) % blogList.length;
  const nextIndex = (currentIndex + 1) % blogList.length;

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h1 className="text-5xl font-extrabold text-gray-400 mb-4">Oops!</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Blog Not Found</h2>
        <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/blog")}> &larr; Back to Blog </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <Button onClick={() => navigate("/blog")}> &larr; Back to Blog </Button>
        <img src={blog.cover} alt={blog.title} className="w-full h-72 object-cover rounded mb-8" />
        <h1 className="text-5xl font-extrabold mb-2 tracking-tight">{blog.title}</h1>
        <p className="text-zinc-500 text-sm mb-4">{new Date(blog.date).toLocaleString('default', { month: 'short', year: 'numeric' })} &middot; {blog.author}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.map((tag) => (
            <span key={tag} className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded text-xs font-semibold">{tag}</span>
          ))}
        </div>
        <div className="prose prose-zinc max-w-none mb-8">
          {blog.content.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <div className="mt-16 flex justify-between">
          <Button onClick={() => navigate(`/blog/${blogList[prevIndex].slug}`)}>
            Previous
          </Button>
          <Button onClick={() => navigate(`/blog/${blogList[nextIndex].slug}`)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
