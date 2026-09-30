import React from "react";

import SEO from '../../components/SEO';
import Button from '../../components/ui/Button';

const Simple404 = () => {
    return (
        <>
            <SEO
                title="404 - Page Not Found | Alberto Crapanzano"
                description="The page you're looking for doesn't exist. Return to the homepage to explore projects and blog posts."
                url="/404"
                noindex={true}
            />
            <div className="flex min-h-[60svh] flex-col items-center justify-center text-center">
                <p className="font-display text-8xl font-bold text-text-muted">404</p>
                <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-text-primary">
                    Page Not Found
                </h1>
                <p className="mt-2 text-text-secondary">
                    The page you&apos;re looking for doesn&apos;t exist.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Button to="/" variant="quiet">← Go Home</Button>
                    <Button to="/projects" variant="secondary">Browse projects</Button>
                </div>
            </div>
        </>
    );
};

export default Simple404;
