import React from "react";
import { motion } from "framer-motion";
import SocialIcon from "../SocialIcon/SocialIcon";

const SocialPanel = ({ contact, className = "" }) => {
  const socialLinks = [
    { platform: 'github', url: contact.github },
    { platform: 'linkedin', url: contact.linkedin },
    { platform: 'email', url: contact.email },
    { platform: 'cv', url: contact.cv }
  ].filter(link => link.url); // Only include links that have URLs

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6,
        ease: "easeOut"
      }}
      className={`flex justify-center mx-auto  backdrop-blur-sm  border border-gray-700 w-fit ${className}`}
    >
      <div className="flex flex-row p-2 gap-1">
        {socialLinks.map((link, index) => (
          <motion.div
            key={link.platform}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.1 }}
            className={link.platform === 'cv' ? 'min-w-fit' : ''}
          >
            <SocialIcon 
              platform={link.platform} 
              url={link.url}
              className="hover:bg-white/10 rounded-md transition-all"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SocialPanel;
