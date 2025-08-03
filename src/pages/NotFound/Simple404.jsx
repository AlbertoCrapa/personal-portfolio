import React from "react";
import { Link } from "react-router-dom";
import SplitText from "../../utils/ReactBits/SplitText/SplitText";

const Simple404 = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="text-center">

                <SplitText
                    text="404"
                    className="text-8xl font-extrabold text-gray-400 mb-4"
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
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
                <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>

                <div className="space-x-4">
                    <Link
                        to="/"
                        className="bg-zinc-900 text-white px-6 py-2 hover:bg-zinc-700 transition-colors"
                    >
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="border cursor-pointer border-zinc-900 text-zinc-900 px-6 py-[0.3rem] hover:bg-zinc-900 hover:text-white transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Simple404;
