import { motion, useScroll, useSpring } from "framer-motion";

/** Thin progress bar pinned to the top of the viewport. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return <motion.div className="scrollProgress" style={{ scaleX }} />;
}
