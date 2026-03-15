import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../layouts/Layout';
import SEO from '../../components/SEO';
import SectionHeader from '../../components/ui/SectionHeader';
import ProjectCard from '../../components/ui/ProjectCard';
import Button from '../../components/ui/Button';
import SocialLink from '../../components/ui/SocialLink';
import projectData from '../../data/projects.json';
import playgroundData from '../../data/playground.json';
import blogData from '../../data/blog.json';
import data from '../../data/data.json';


const Home = () => {
  const { news, contact } = data;
  const projects = Object.values(projectData.projects);
  const playgroundItems = playgroundData.playground || [];
  const blogs = blogData.blogs;

  // Get featured projects (first 3)
  const featuredProjects = projects.slice(0, 3);

  // Build social links for mobile footer
  const socialLinks = [
    contact?.github && { label: 'Github', url: contact.github, hoverColor: 'hover:text-[#beabf6ff]', glowColor: '#8a5cf633' },
    contact?.linkedin && { label: 'LinkedIn', url: contact.linkedin, hoverColor: 'hover:text-[#7DD3FC]', glowColor: '#0a66c22e' },
    contact?.instagram && { label: 'Instagram', url: contact.instagram, hoverColor: 'hover:text-[#f5a9d0ff]', glowColor: '#e4405e2e' },
    contact?.itchio && { label: 'Itch.io', url: contact.itchio, hoverColor: 'hover:text-[#FCA5A5]', glowColor: '#fa5c5c34' },
  ].filter(Boolean);

  // Parse news text with simple markdown links [text](url)
  const parseNewsText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, i) => {
      const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        return (
          <Link key={i} to={match[2]} className="text-accent-blue hover:underline font-medium">
            {match[1]}
          </Link>
        );
      }
      return part;
    });
  };

  return (

    <Layout>
      <SEO
        title="Alberto Crapanzano - Game Technical Designer & Creative Developer"
        description="Alberto Crapanzano (Albyeah) is a Creative Developer specializing in game Technical Design and Programming. Expert in Unity, Unreal Engine, and digital experiences."
        keywords="Alberto Crapanzano, Albyeah, Game Developer, Technical Designer, Creative Developer, Unity, Unreal Engine"
        url="/"
        isHomepage={true}
      />

      <div className="space-y-8 lg:space-y-12">
        {/* Background SVG
        <img src="img/BG.svg" alt="" className="w-full h-auto" />*/}

        {/* Bento Grid Layout */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* Projects Section - Left Column */}
          <section className="lg:col-span-7 space-y-4">
            <SectionHeader title="Projects" seeAllLink="/projects" />

            {/* Main featured project (large) */}
            {featuredProjects[0] && (
              <ProjectCard project={featuredProjects[0]} size="large" />
            )}

            {/* Two smaller projects */}
            <div className="grid grid-cols-2 gap-4">
              {featuredProjects.slice(1, 3).map((project) => (
                <ProjectCard key={project.slug} project={project} size="medium" />
              ))}
            </div>
          </section>

          {/* Right Column - News and Sketches */}
          <aside className="lg:col-span-5 space-y-6">
            {/* News Section */}
            {news && (
              <section className="bg-surface rounded-xl p-5 mt-11 lg:p-6">
                <h2 className="text-lg font-bold text-text-primary mb-3">News</h2>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  {parseNewsText(news.text)}
                </p>
                {news.buttonLink && (
                  <Button
                    to={news.buttonLink}
                    variant="primary"
                    size="md"
                    fullWidth
                  >
                    <span className="flex items-center gap-2">
                      {news.buttonIcon === 'play' && (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21 12l-18 12v-24l18 12z" />
                        </svg>
                      )}
                      {news.buttonText || 'Learn More'}
                    </span>
                  </Button>
                )}
              </section>
            )}

            {/* Playground Section */}
            <section>
              <SectionHeader title="Playground" seeAllLink="/playground" />
              <div className="grid grid-cols-2 gap-3">
                {playgroundItems.slice(0, 4).map((item) => (
                  <ProjectCard key={item.slug} project={item} size="small" basePath="/playground" />
                ))}
              </div>
            </section>
          </aside>
        </div>

        {/* Blog Preview */}
        {blogs.length > 0 && (
          <section>
            <SectionHeader title="Recent Posts" seeAllLink="/blog" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blogs.slice(0, 2).map((blog) => {
                const coverSrc = blog.cover || blog.media?.[0]?.src;

                return (
                  <Link
                    key={blog.slug}
                    to={`/blog/${blog.slug}`}
                    className="bg-surface rounded-xl p-4 hover:bg-surface-hover transition-colors group flex items-center gap-4"
                  >
                    {/* Small thumbnail */}
                    {coverSrc && (
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                        <img
                          src={coverSrc}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text-primary group-hover:text-accent-blue transition-colors mb-1 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-text-muted">
                        {new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Mobile Social Links & CV - Only visible on mobile */}
        <section className="lg:hidden pt-6 border-t border-border">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Connect</p>
          <ul className="space-y-1 mb-4">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <SocialLink href={link.url} hoverColor={link.hoverColor} glowColor={link.glowColor}>
                  {link.label}
                </SocialLink>
              </li>
            ))}
          </ul>
          {contact?.cv && (
            <a
              href={contact.cv}
              download
              className="flex font-semibold items-center gap-2 text-sm text-text-secondary hover:text-[#86EFAC] transition-all duration-300"
              onMouseEnter={(e) => e.currentTarget.style.textShadow = '0 0 8px #22c55e43, 0 0 16px rgba(34, 197, 94, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.textShadow = 'none'}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download CV</span>
            </a>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Home;
