import React from "react";
import { Link } from "react-router-dom";
import SplitText from "../../utils/ReactBits/SplitText/SplitText";
import SEO from "../../components/SEO/SEO";

const Simple404 = () => {
    return (
    <>
        <SEO 
            title="404 - Page Not Found | Alberto Crapanzano"
            description="The page you're looking for doesn't exist. Return to Alberto Crapanzano's portfolio homepage to explore projects and blog posts."
            url="/404"
            noindex={true}
        />
        <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4">
                <div className="text-center">

                <SplitText
                    text="404"
                    className="text-8xl font-extrabold text-gray-dark mb-4"
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
                <h2 className="text-2xl font-bold text-black mb-2">Page Not Found</h2>
                <p className="text-gray-dark mb-8">The page you're looking for doesn't exist.</p>

                <div className="space-x-4">
                    <Link
                        to="/"
                        className="bg-black text-white px-6 py-2 hover:bg-gray-dark transition-colors"
                    >
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="border cursor-pointer rounded-2xl border-black text-black px-6 py-[0.3rem] hover:bg-black hover:text-white transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    </>
    );
};

export default Simple404;
