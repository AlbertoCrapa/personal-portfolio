import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const InViewSection = ({ children, triggerOnce = true, className }) => {
  const [ref, inView] = useInView({
    triggerOnce,
    threshold: 0.1,
  });

  return (
    <motion.section
      ref={ref}
      className={ "daje " + className}
      initial={{ opacity: 0, y: 0 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
};


export default InViewSection;