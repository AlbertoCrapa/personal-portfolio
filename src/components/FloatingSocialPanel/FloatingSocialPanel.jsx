

import React from "react";
import { motion } from "framer-motion";
import SocialIcon from "../SocialIcon/SocialIcon";

const FloatingSocialPanel = ({ contact }) => {
  const socialLinks = [
    { platform: "github", url: contact.github },
    { platform: "linkedin", url: contact.linkedin },
    { platform: "email", url: contact.email },
    { platform: "cv", url: contact.cv },
  ].filter((link) => link.url);

  return (
    <div className="bg-white rounded-2xl rounded-bl-none pointer-events-auto shadow-sm">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 35, duration: 0.2 }}
      >
        <div className="flex flex-row gap-2">
          {socialLinks.map((link, index) => (
            <motion.div
              key={link.platform}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className={link.platform === "cv" ? "min-w-fit" : ""}
            >
              <SocialIcon
                platform={link.platform}
                url={link.url}
                theme="light"
                className="hover:bg-white/10 transition-all"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FloatingSocialPanel;
