import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "Alberto Crapanzano - Game Technical Designer & Creative Developer",
  description = "Alberto Crapanzano (Albyeah) is a Creative Developer based near Milan, specializing in game Technical Design and Programming for video games. Combining strong programming skills with artistic vision to create innovative digital experiences.",
  keywords = "Alberto Crapanzano, Albyeah, Game Developer, Technical Designer, Creative Developer, Unity, Unreal Engine, Milan, Video Games, Tech Art, React Developer",
  image = "https://albyeah.com/img/profile.jpg",
  url = "https://albyeah.com",
  type = "website",
  author = "Alberto Crapanzano",
  canonical,
  noindex = false,
  isHomepage = false
}) => {
  // Ensure URL is absolute
  const absoluteUrl = url.startsWith('http') ? url : `https://albyeah.com${url}`;
  const canonicalUrl = canonical || absoluteUrl;
  
  // Schema.org structured data for homepage
  const personSchema = isHomepage ? {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Alberto Crapanzano",
    "alternateName": "Albyeah",
    "url": "https://albyeah.com",
    "image": "https://albyeah.com/img/profile.jpg",
    "jobTitle": "Game Technical Designer & Creative Developer",
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Milan",
      "addressCountry": "IT"
    },
    "alumniOf": {
      "@type": "Organization",
      "name": "IED Milano"
    },
    "sameAs": [
      "https://www.linkedin.com/in/alberto-c-905a69232/",
      "https://github.com/AlbertoCrapa"
    ],
    "knowsAbout": [
      "Game Development",
      "Unity",
      "Unreal Engine",
      "C++",
      "React",
      "Technical Design"
    ]
  } : null;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:site_name" content="Alberto Crapanzano Portfolio" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:url" content={absoluteUrl} />
      <meta name="twitter:creator" content="@albyeah" />
      <meta name="twitter:site" content="@albyeah" />
      
      {/* Additional Meta */}
      <meta name="language" content="English" />
      <meta name="theme-color" content="#000000" />
      
      {/* Schema.org Structured Data */}
      {isHomepage && personSchema && (
        <script type="application/ld+json">
          {JSON.stringify(personSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;