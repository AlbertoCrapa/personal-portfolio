
import { useEffect } from "react";
import data from "../../data/data.json";
import Navbar from "../../components/Navbar/Navbar";
import ResponsiveGrid from "../../components/ResponsiveGrid/ResponsiveGrid";
import WorkCard from "../../components/WorkCard/WorkCard";
import MailCTA from "../../components/MailCTA/MailCTA";

import SocialPanel from "../../components/SocialPanel/SocialPanel";
import { useState, useRef } from "react";
import SplitTextAnim from "../../utils/ReactBits/SplitText/SplitText";
import RotatingText from "../../utils/RotatingText/RotatingText";
import { motion, AnimatePresence } from "framer-motion";
import { useAnimation } from "../../contexts/AnimationContext";


const Home = () => {
  const { nickname, fullname, title, about, skills, projects, contact } = data;
  const factsTextRef = useRef();
  const [currentFact, setCurrentFact] = useState('');
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
      {/* Floating Social Panel */}
    
      
      {/* Center Animation Overlay - only on first visit */}
      <AnimatePresence>
        {showCenterAnimation && !hasPlayedInitialAnimation && (
          <motion.div
            className="fixed inset-0 z-40 bg-white flex items-center justify-center md:pt-0 pt-32"
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
        transition={{ duration: 0.6, delay: hasPlayedInitialAnimation ? 0 : 0.6, ease: "easeInOut" }}
      >
        <Navbar  cont={contact}/>
      </motion.div>

      {/* <CurvedLoop
        marqueeText="Be ✦ Creative ✦ With ✦ React ✦ Bits ✦"
        speed={3}
        curveAmount={500}
        direction="right"
        interactive={true}
        className="custom-text-style "
      /> */}

      <motion.header
        className="bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: hasPlayedInitialAnimation ? 0 : 0.5, ease: "easeInOut" }}
      >
        <div className="container mx-auto text-left px-4">
          {/* Nickname that appears after center animation */}
          <motion.div
            className="inline-block"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: hasPlayedInitialAnimation ? 0.1 : 0.6,
              ease: "easeOut"
            }}
          >
            <h1 className="min-[532px]:text-9xl text-7xl font-extrabold mb-2 animate-squiggly">
              {nickname}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: hasPlayedInitialAnimation ? 0.2 : 0.7,
              ease: "easeOut"
            }}
          >
            <RotatingText
              texts={facts}
              mainClassName="text-3xl text-gray-500 mb-6 notranslate"
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
          </motion.div>
        </div>
      </motion.header>

      <motion.section
        id="about"
        className="py-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          delay: hasPlayedInitialAnimation ? 0.3 : 0.8,
          ease: "easeOut"
        }}
      >
        <div className="container mx-auto px-4 w-full md:w-2/4 mr-0 md:mr-12">
          <h2 className="text-4xl font-semibold sm:mb-1 mb-4 text-left md:ml-none  ml-auto md:max-w-none max-w-[210px]">{fullname}</h2>
          <p className="max-w-full md:max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed">
            {about.description}
          </p>
          <p className="max-w-full md:max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed">
            <br />
            {about.description2}
          </p>
          <div className="absolute bottom-[10px] right-[10px] opacity-25 items-center mt-6 animate-bounce">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </div>
          {/* <div style={{ height: '600px', position: 'relative' }}>
            <Folder size={2} color="#3b3a3cff" className="custom-folder" />
          </div> */}
        </div>
      </motion.section>

      <motion.section
        id="projects"
        className="py-32"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          delay: hasPlayedInitialAnimation ? 0.4 : 0.9,
          ease: "easeOut"
        }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-semibold mb-8 text-center">main Projects</h2>
          
          {/* Important Projects - 2 per row, bigger */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 ">
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
                  <WorkCard work={project} />
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
          duration: 0.6, 
          ease: "easeOut"
        }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-semibold mb-8 text-center">my others Projects</h2>
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

      <motion.section
        id="contact"
        className="py-4 pt-32 bg-zinc-900"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          delay: hasPlayedInitialAnimation ? 0.6 : 1.1,
          ease: "easeOut"
        }}
      >
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-semibold mb-6 text-zinc-200">Get In Touch</h2>
          <MailCTA contact={contact} />
          
          {/* Social Panel - Normal positioned variant */}
          <SocialPanel contact={contact} className="mt-8 mb-8" />
          
        </div>

        <p className="w-fit mx-auto bottom-0 pt-8 text-zinc-300 ">
          © 2025 Alberto Crapanzano. All rights reserved.
        </p>
      </motion.section>
    </div>

  );
};

export default Home;