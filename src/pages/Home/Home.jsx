import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../layouts/Layout';
import SEO from '../../components/SEO';
import SectionHeader from '../../components/ui/SectionHeader';
import ProjectCard from '../../components/ui/ProjectCard';
import Button from '../../components/ui/Button';
import projectData from '../../data/projects.json';
import playgroundData from '../../data/playground.json';
import blogData from '../../data/blog.json';
import data from '../../data/data.json';

/**
 * Home Page
 * Bento grid layout matching the reference design
 * Desktop: Projects left, News+Playground right
 * Mobile: Stacked layout
 */
const Home = () => {
  const { fullname, about } = data;
  const projects = Object.values(projectData.projects);
  const playgroundItems = playgroundData.playground || [];
  const blogs = blogData.blogs;

  // Get featured projects (first 3)
  const featuredProjects = projects.slice(0, 3);

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
            <section className="bg-surface rounded-xl p-5 lg:p-6">
              <h2 className="text-lg font-bold text-text-primary mb-3">News</h2>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                I'm currently working on my first game, <Link to="/work/deadly-nightshade" className="text-accent-blue hover:underline font-medium">Deadly Nightshade</Link>.
                If you like the project, consider checking it out!
              </p>
              <Button
                to="/work/deadly-nightshade"
                variant="primary"
                size="md"
                fullWidth
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 12l-18 12v-24l18 12z" />
                  </svg>
                  View Deadly Nightshade
                </span>
              </Button>
            </section>

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
              {blogs.slice(0, 2).map((blog) => (
                <Link
                  key={blog.slug}
                  to={`/blog/${blog.slug}`}
                  className="bg-surface rounded-xl p-4 hover:bg-surface-hover transition-colors group flex items-center gap-4"
                >
                  {/* Small thumbnail */}
                  {blog.media?.[0]?.src && (
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                      <img
                        src={blog.media[0].src}
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
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default Home;
