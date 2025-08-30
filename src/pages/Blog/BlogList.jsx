import React from "react";
import data from "../../data/blog.json";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../components/Button/Button";
import Footer from "../../components/Footer/Footer";
import dataMain from "../../data/data.json";


const BlogList = () => {
  const navigate = useNavigate();
return (
    <>
        <div className="container mx-auto px-4 py-16">
            <div className="mb-6">
                <Button onClick={() => navigate("/")}> &larr; Back to Home </Button>
            </div>
            <h1 className="text-5xl font-extrabold mb-10 text-center tracking-tight">Blog</h1>
            <div className="grid md:grid-cols-2 gap-10">
                {data.blogs.map((blog) => (
                    <Link key={blog.slug} to={`/blog/${blog.slug}`} className="block group">
                        <div className="bg-white/90 transition-all active:scale-95 border overflow-hidden hover:shadow-xl transition outline hover:outline-4 outline-2 outline-black">
                            <img src={blog.cover} alt={blog.title} className="w-full h-56 object-cover" />
                            <div className="p-6">
                                <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-700 transition-colors">{blog.title}</h2>
                                <p className="text-zinc-500 text-sm mb-2">{new Date(blog.date).toLocaleString('default', { month: 'short', year: 'numeric' })} &middot; {blog.author}</p>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {blog.tags.map((tag) => (
                                        <span key={tag} className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded text-xs font-semibold">{tag}</span>
                                    ))}
                                </div>
                                <p className="text-zinc-700 mb-2">{blog.excerpt}</p>
                                <span className="text-blue-600 font-semibold">Read more &rarr;</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
        <Footer contact={dataMain.contact} showMailCTA={false} />
    </>
);
};

export default BlogList;
