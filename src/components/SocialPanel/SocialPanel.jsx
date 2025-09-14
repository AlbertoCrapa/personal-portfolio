
import React from "react";
import { motion } from "framer-motion";
import SocialIcon from "../SocialIcon/SocialIcon";

const SocialPanel = ({ contact, className = "" }) => {
  const socialLinks = [
    { platform: 'github', url: contact?.github },
    { platform: 'linkedin', url: contact?.linkedin },
    { platform: 'cv', url: contact?.cv }
  ].filter(link => link.url);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`flex justify-center mx-auto backdrop-blur-sm rounded-3xl rounded-bl-none bg-gray-10 w-fit ${className}`}
    >
      <div className="flex flex-row px-2 py-1 md:gap-1 gap-0">
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
              theme="dark"
              className="mx-2 hover:bg-white/10 rounded-md transition-all"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SocialPanel;
