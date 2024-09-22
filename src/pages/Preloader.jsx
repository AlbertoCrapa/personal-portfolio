// src/components/PreLoader.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Preloader = ({ setLoading }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Disable scrolling when the pre-loader is active
    document.body.style.overflow = 'hidden';

    const updateProgress = () => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Set a delay before triggering the fade-out animation
          setTimeout(() => setFadeOut(true), 500);
          setTimeout(() => document.body.style.overflow = '', 590);
          return 100;
        }

        // Generate a random number to increment the progress (1-5 for example)
        const increment = Math.floor(Math.random() * 2) + 1;

        // Ensure progress does not exceed 100
        return Math.min(prev + increment, 100);
      });

      // Generate a random interval (between 100ms to 500ms)
      const randomInterval = Math.floor(Math.random() * 70) + 20;

      setTimeout(updateProgress, randomInterval);
    };

    // Start the first timeout
    updateProgress();
    
   
  }, [setLoading]);

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-zinc-900 z-50 font-sans"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }} // Fade-out duration
          onAnimationComplete={() => {
            if (fadeOut) {
              // When the fade-out animation is complete, hide the loader
              setLoading(false);
            }
          }}
        >
          <motion.div
            className="font-regular text-white text-2xl "
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {progress}%
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
