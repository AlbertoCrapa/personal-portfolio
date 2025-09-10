

import { useEffect } from "react";
import RichText from "../../utils/RichText";
import data from "../../data/data.json";
import projectData from "../../data/projects.json";
import blogData from "../../data/blog.json";
import Navbar from "../../components/Navbar/Navbar";
import ResponsiveGrid from "../../components/ResponsiveGrid/ResponsiveGrid";
import WorkCard from "../../components/WorkCard/WorkCard";
import MailCTA from "../../components/MailCTA/MailCTA";
import Button from "../../components/Button/Button";
import SocialPanel from "../../components/SocialPanel/SocialPanel";
import { useState } from "react";
import SplitTextAnim from "../../utils/ReactBits/SplitText/SplitText";
import RotatingText from "../../utils/RotatingText/RotatingText";
import { motion, AnimatePresence } from "framer-motion";
import { useAnimation } from "../../contexts/AnimationContext";
import { useNavigate } from "react-router-dom";
import SEO from "../../components/SEO/SEO";
import FloatingSocialPanel from "../../components/FloatingSocialPanel/FloatingSocialPanel";



const Home = () => {
  const { nickname, fullname, about, contact } = data;
  const projects = projectData.projects;
  const blogs = blogData.blogs;
  const navigate = useNavigate();
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [showCenterAnimation, setShowCenterAnimation] = useState(false);
  const { hasPlayedInitialAnimation, setHasPlayedInitialAnimation } = useAnimation();
  const facts = require('../../data/facts.json').facts;


  useEffect(() => {
    // Only play animation if it hasn't been played before
    if (!hasPlayedInitialAnimation) {
      setShowCenterAnimation(true);

      // Disable scrolling during animation
      document.body.style.overflow = 'hidden';

      // Start the normal animation after initial center animation
      const timer = setTimeout(() => {
        setShowCenterAnimation(false);
        setTimeout(() => {
          setIsAnimationComplete(true);
          setHasPlayedInitialAnimation(true);
          // Re-enable scrolling after animation
          document.body.style.overflow = 'unset';
        }, 300); // Short delay for normal fade transition
      }, 1000); // Show center animation for 1.5 seconds

      return () => {
        clearTimeout(timer);
        // Cleanup: re-enable scrolling
        document.body.style.overflow = 'unset';
      };
    } else {
      // If animation has already played, show everything immediately
      setIsAnimationComplete(true);
      // Ensure scrolling is enabled
      document.body.style.overflow = 'unset';
    }
  }, [hasPlayedInitialAnimation, setHasPlayedInitialAnimation]);


  return (
    <div className="min-h-screen flex flex-col overscroll-none">
      <SEO
        title="Alberto Crapanzano - Game Technical Designer & Creative Developer"
        description="Creative Developer based near Milan, specializing in game Technical Design and Programming for video games. Combining strong programming skills with artistic vision to create innovative digital experiences."
        keywords="Alberto Crapanzano, Albyeah, Game Developer, Technical Designer, Creative Developer, Unity, Unreal Engine, Milan, Video Games, Tech Art, React Developer"
        url="/"
      />

      {isAnimationComplete && <></>}


      {/* Center Animation Overlay - only on first visit */}
      <AnimatePresence>
        {showCenterAnimation && !hasPlayedInitialAnimation && (
          <motion.div
            className="fixed inset-0 md:z-40 z-[100] bg-gray-light flex items-center justify-center "
            initial={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <motion.div
              className="inline-block" // Use inline-block instead of full width h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
                delay: 0.1
              }}
            >
              {/* <span className="min-[532px]:text-9xl text-7xl font-extrabold animate-squiggly">
                {nickname}
              </span> */}
              <SplitTextAnim
                text="Hi there!"
                className="min-[532px]:text-9xl text-7xl font"
                delay={50}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
              />

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: hasPlayedInitialAnimation ? 0 : 0.6, ease: "easeInOut" }}
      >
        <Navbar cont={contact} />
      </motion.div>

      <section
        className="bg-white rounded-3xl  flex flex-col items-center justify-center w-[calc(100%-var(--spacing))] max-w-[1800px]  mx-auto min-h-[75vh] py-6 rounded-bl-none"
        style={{ boxSizing: 'border-box' }}
      >

        <h1 className="min-[532px]:text-9xl text-7xl text-black mr-auto md:ml-12 ml-4 font-serif font-bold mb-2 animate-squiggly">
          {nickname}
        </h1>
        <RotatingText
          texts={facts}
          mainClassName="md:text-4xl text-2xl text-gray-dark script mr-auto md:ml-12 ml-4 opacity-50 mb-6 notranslate"
          translate="no"
          staggerFrom={"first"}
          initial={{ y: "120%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          staggerDuration={0.025}
          splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          rotationInterval={5000}
        />

        <div className="ml-auto md:mr-12 mr-4 px-3">
          <h2 className="text-5xl serif text-black font-semibold mb-4 mt-2 text-left w-full max-w-2xl ">{fullname}</h2>
          <div className="max-w-2xl w-full mx-auto text-lg text-gray-dark leading-relaxed space-y-2 text-left">
            <RichText text={about.description} />
            {/* <RichText text={about.description2} /> */}
          </div>
        </div>

      </section>

      {/* Sticky at top when scrolled */}
      <div className="sticky pointer-events-none  ml-[calc(var(--spacing)/2)] py-[calc((100vh-(75vh+66px+48px))-1.5rem)] left-4 top-4 z-50 ">
        <FloatingSocialPanel contact={contact} />
      </div>


      <motion.section
        id="projects"
        className="py-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: hasPlayedInitialAnimation ? 0.4 : 0.9,
          ease: "easeOut"
        }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-black serif font-semibold mb-2 text-center">my Projects</h2>
          <p className="text-base script mb-4  md:text-xl text-gray-dark italic  mb-8 max-w-2xl mx-auto px-4 text-center"> Wow! Click and discover</p>


          {/* Important Projects - 2 per row, bigger */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 ">
            {Object.values(projects)
              .filter(project => project.important === true)
              .map((project, index) => (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  className="h-full"
                >
                  <WorkCard work={project} sizeBig={true} />
                </motion.div>
              ))}
          </div>
        </div>
      </motion.section>

      {/* Other Projects Section */}
      <motion.section
        id="other-projects"
        className="py-16  pt-0 md:pb-32   pb-12 "
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.4,
          ease: "easeOut"
        }}
      >
        <div className="container mx-auto px-4 max-w-screen-xl">
          <ResponsiveGrid>
            {Object.values(projects)
              .filter(project => project.important !== true)
              .map((project, index) => (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <WorkCard work={project} />
                </motion.div>
              ))}
          </ResponsiveGrid>
        </div>
      </motion.section>

      {/* Blog Section */}
      <motion.section
        id="blog"
        className="py-8 md:py-2 pb-16 md:pb-32 bg-bg"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.4,
          ease: "easeOut"
        }}
      >
        <div className="container mx-auto px-4 max-w-screen-lg">
          {/* Header */}
          <div className="text-center mb-8 md:mb-8">
            <motion.h2
              className="text-4xl  font-semibold mb-2 "
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              From the Blog
            </motion.h2>
            <motion.p
              className="text-base md:text-xl text-gray-dark italic max-w-2xl mx-auto px-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Sharing insights, tutorials, and lessons learned.
            </motion.p>
          </div>

          {/* Featured Blog Posts */}
          <div className="flex flex-col md:flex-row justify-center items-stretch mb-8 md:mb-8 gap-6">
            {blogs.slice(0, 1).map((blog, index) => (
              <motion.article
                key={blog.slug}
                className="bg-gray-light overflow-hidden border shadow-sm hover:shadow-lg transition outline transition-all hover:outline-4 active:scale-95 transition-all duration-300 cursor-pointer group max-w-2xl w-full"
                onClick={() => navigate(`/blog/${blog.slug}`)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                data-cursor-text="Read Article"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  {blog.media && blog.media[0] && blog.media[0].src && (
                    <div className="w-full md:w-1/3 min-h-[12rem] md:min-h-[16rem] flex-shrink-0">
                      <img
                        src={blog.media[0].src}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 rounded-lg"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className={`p-6 md:p-8 flex flex-col justify-between ${blog.media && blog.media[0] && blog.media[0].src ? 'md:w-2/3' : 'w-full'}`}>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-medium bg-gray-light text-gray-dark px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-lg md:text-xl font-bold mb-3 text-black group-hover:text-blue-700 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-sm md:text-base text-gray-dark mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <time className="text-xs md:text-sm text-gray-dark">
                        {new Date(blog.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                      <span className="text-blue-600 text-sm font-medium transition-transform">
                        Read more →
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <p className="text-gray-dark mb-6 text-sm md:text-base">
              Explore more tutorials, insights, and development stories
            </p>
            <Button
              onClick={() => navigate('/blog')}
              className="px-6 md:px-8 py-3 text-base md:text-lg w-full max-w-xs mx-auto"
            >
              View All Posts
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="contact"
        className="py-4 pt-32 bg-black"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: hasPlayedInitialAnimation ? 0.6 : 1.1,
          ease: "easeOut"
        }}
      >
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-semibold mb-6 text-gray-light">Get In Touch</h2>
          <MailCTA contact={contact} />

          {/* Social Panel - Normal positioned variant */}
          <SocialPanel contact={contact} className="mt-8 mb-8" />

        </div>

        <p className="w-fit mx-auto bottom-0 pt-8 text-gray DEFAULT ">
          © 2025 Alberto Crapanzano. All rights reserved.
        </p>
      </motion.section>
    </div>

  );
};

export default Home;