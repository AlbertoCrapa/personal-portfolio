import React, { useEffect } from "react";
import data from "../../data/blog.json";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../components/Button/Button";
import Footer from "../../components/Footer/Footer";
import dataMain from "../../data/data.json";
import SEO from "../../components/SEO/SEO";


const BlogList = () => {
    const navigate = useNavigate();
    
    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <SEO 
                title="Blog - Alberto Crapanzano"
                description="Game development tutorials, insights, and project updates by Alberto Crapanzano - Game Technical Designer & Creative Developer"
                keywords="Game Development Blog, Unity, Unreal Engine, C++, Technical Design, Alberto Crapanzano"
                url="/blog"
            />
            <div className="container mx-auto px-4 md:py-16 py-8 bg-bg">
                <div className="mb-6">
                    <Button  onClick={() => navigate("/")}> &larr; Back to Home </Button>
                </div>
                <h1 className="text-5xl serif font-bold mb-2 text-center tracking-tight text-black">Blog</h1>
                <p className="text-xl text-center mb-10 text-gray-dark italic">More useful than a sticky note, less boring than a technical manual. </p>
                <div className="grid md:grid-cols-2 gap-10">
                    {data.blogs.map((blog) => (
                        <Link key={blog.slug} to={`/blog/${blog.slug}`} className="block group" data-cursor-text="Read Article" data-cursor-color="#34C759">
                            <div className="bg-white transition-all active:scale-95 hover:scale-[1.01]  rounded-3xl rounded-bl-none  overflow-hidden transition outline-black">
                                {blog.media && blog.media.length > 0 && blog.media[0].src ? (
                                    <div className="w-full h-56 overflow-hidden">
                                        <img
                                            src={blog.media[0].src}
                                            alt={blog.title}
                                            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                ) : null}
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-700 transition-colors text-black">{blog.title}</h2>
                                    <p className="text-gray-dark text-sm mb-2">{new Date(blog.date).toLocaleString('default', { month: 'short', year: 'numeric' })} &middot; {blog.author}</p>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {blog.tags.map((tag) => (
                                            <span key={tag} className="bg-gray-light text-gray-dark px-2 py-0.5 rounded-xl rounded-bl-none text-xs font-semibold">{tag}</span>
                                        ))}
                                    </div>
                                    <p className="text-black mb-2">{blog.excerpt}</p>
                                    {/* <span className="text-blue-600 font-semibold">Read more &rarr;</span> */}
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
