import React from "react";
import { Link } from "react-router-dom";
import Layout from "../../layouts/Layout";
import SEO from '../../components/SEO';

const Simple404 = () => {
    return (
        <Layout>
            <SEO
                title="404 - Page Not Found | Alberto Crapanzano"
                description="The page you're looking for doesn't exist. Return to the homepage to explore projects and blog posts."
                url="/404"
                noindex={true}
            />
            <div className="min-h-[60svh] flex flex-col items-center justify-center text-center">
                <h1 className="text-8xl font-bold text-text-muted mb-4">404</h1>
                <h2 className="text-2xl font-bold text-text-primary mb-2">Page Not Found</h2>
                <p className="text-text-secondary mb-8">The page you're looking for doesn't exist.</p>
                <Link
                    to="/"
                    className="bg-accent-blue text-white rounded-lg px-6 py-3 font-semibold hover:bg-accent-blue/90 transition-colors"
                >
                    ← Go Home
                </Link>
            </div>
        </Layout>
    );
};

export default Simple404;
