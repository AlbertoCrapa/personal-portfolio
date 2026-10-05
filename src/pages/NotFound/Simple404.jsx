import React from 'react';

import SEO from '../../components/SEO';
import NotFoundState from '../../components/ui/NotFoundState';

const Simple404 = () => (
    <>
        <SEO
            title="404 - Page Not Found | Alberto Crapanzano"
            description="The page you're looking for doesn't exist. Return to the homepage to explore projects and blog posts."
            url="/404"
            noindex={true}
        />
        <NotFoundState
            title="Page not found"
            description="This address doesn't lead anywhere. The projects are a good place to start."
            to="/projects"
            label="Browse projects"
        />
    </>
);

export default Simple404;
