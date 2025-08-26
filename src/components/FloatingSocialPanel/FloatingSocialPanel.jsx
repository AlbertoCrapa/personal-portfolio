import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SocialIcon from "../SocialIcon/SocialIcon";

const FloatingSocialPanel = ({ contact }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 300; // Show after scrolling 300px
      setIsVisible(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const socialLinks = [
    { platform: 'github', url: contact.github },
    { platform: 'linkedin', url: contact.linkedin },
    { platform: 'email', url: contact.email },
    { platform: 'cv', url: contact.cv }
  ].filter(link => link.url); // Only include links that have URLs

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300, 
            damping: 35, //25
            duration: 0.5 
          }}
          className="fixed top-4 left-4 z-10 bg-black/90 backdrop-blur-sm  shadow-[10px_10px_30px_rgba(255,255,255,0.5)] border border-gray-700"
        >
          <div className="flex flex-row p-2 gap-1">
            {socialLinks.map((link, index) => (
              <motion.div
                key={link.platform}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className={link.platform === 'cv' ? 'min-w-fit' : ''}
              >
                <SocialIcon 
                  platform={link.platform} 
                  url={link.url}
                  className="hover:bg-white/10  transition-all"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingSocialPanel;
