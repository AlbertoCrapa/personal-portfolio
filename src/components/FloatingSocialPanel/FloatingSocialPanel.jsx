

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SocialIcon from "../SocialIcon/SocialIcon";

const FloatingSocialPanel = ({ contact }) => {
  const panelRef = useRef(null);
  const [isFixed, setIsFixed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [panelHeight, setPanelHeight] = useState(56);

  useEffect(() => {
    let initialOffset = null;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Responsive bottom offset based on viewport height
      // const bottomOffset = Math.max(100, viewportHeight * 0.15); // 15% of viewport or 100px minimum
      // setIsVisible(scrollY < (documentHeight - viewportHeight - bottomOffset));

      if (!panelRef.current) return;
      const rect = panelRef.current.getBoundingClientRect();
      if (initialOffset === null) {
        initialOffset = rect.bottom + window.scrollY;
      }
      
      // Responsive trigger offset based on viewport height
      const triggerOffset = Math.max(60, viewportHeight * 0.1); // 10% of viewport or 60px minimum
      if (window.scrollY > initialOffset - triggerOffset) {
        setIsFixed(true);
        setPanelHeight(panelRef.current.offsetHeight);
      } else {
        setIsFixed(false);
      }
    };
    const handleResize = () => {
      // Reset initialOffset on resize so it recalculates
      initialOffset = null;
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    setTimeout(handleScroll, 0);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const socialLinks = [
    { platform: "github", url: contact.github },
    { platform: "linkedin", url: contact.linkedin },
    { platform: "email", url: contact.email },
    { platform: "cv", url: contact.cv },
  ].filter((link) => link.url);

  return (
    isVisible && (
      <>
        {isFixed && (
          <div className="pointer-events-none " style={{ height: panelHeight, width: "fit-content", pointerEvents:"none" }} />
        )}
        <div
          ref={panelRef}
          style={
            isFixed
              ? { position: "fixed", top: 24, left: "calc(var(--spacing) / 2)", zIndex: -1, width: "fit-content" }
              : { position: "relative", left: 0, bottom: 0, zIndex: -1, width: "fit-content" }
          }
          className={`bg-white rounded-2xl rounded-bl-none pointer-events-all`}
        >
          <AnimatePresence>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 35, duration: 0.2 }}
            >
              <div className="flex flex-row gap-2 ">
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
          </AnimatePresence>
        </div>
      </>
    )
  )
};

export default FloatingSocialPanel;
