import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

/**
 * next/link for a CRA app. Arc's breadcrumb imports `next/link`; CRA resolves
 * bare imports from src/ (tsconfig baseUrl), so this file answers it and
 * internal hrefs stay client-side router navigations.
 */
const Link = React.forwardRef(({ href, prefetch, replace, scroll, children, ...props }, ref) => {
    const to = typeof href === 'string' ? href : href?.pathname || '';
    if (to.startsWith('/')) return <RouterLink ref={ref} to={to} replace={replace} {...props}>{children}</RouterLink>;
    return <a ref={ref} href={to} {...props}>{children}</a>;
});

export default Link;
