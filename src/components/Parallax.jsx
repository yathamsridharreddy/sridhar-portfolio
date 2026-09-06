import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Scroll-linked vertical drift. Wraps decorative layers so they move at a
 * different rate to the content behind them, which is what gives a page depth.
 *
 * `speed` is how far the element travels across its own scroll range, in px.
 * Positive drifts down, negative drifts up. Transform-only, so it stays on the
 * compositor. Renders a plain div when the user prefers reduced motion.
 */
export default function Parallax({
  children,
  speed = -60,
  className = "",
  as = "div",
  ...rest
}) {
  const reduced = useReducedMotion();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);

  if (reduced) {
    return (
      <div ref={ref} className={className} {...rest}>
        {children}
      </div>
    );
  }

  const Tag = motion[as] ?? motion.div;

  return (
    <Tag ref={ref} className={className} style={{ y }} {...rest}>
      {children}
    </Tag>
  );
}
