import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

/**
 * Wraps children in a card that tilts toward the pointer in 3D and moves a
 * specular highlight with it. Falls back to a plain div for reduced motion
 * and never tilts on touch (pointer events with no hover simply don't fire).
 */
export default function TiltCard({ children, className = "", max = 8, style, ...rest }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const config = { stiffness: 220, damping: 24, mass: 0.6 };
  const sx = useSpring(px, config);
  const sy = useSpring(py, config);

  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const glareX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(sy, [0, 1], ["0%", "100%"]);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  if (reduced) {
    return (
      <div ref={ref} className={`tiltCard ${className}`} style={style} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={`tiltCard ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      {...rest}
      style={{ ...style, rotateX, rotateY, transformStyle: "preserve-3d" }}
    >
      <motion.span
        className="tiltGlare"
        style={{ "--gx": glareX, "--gy": glareY }}
        aria-hidden="true"
      />
      <div className="tiltContent">{children}</div>
    </motion.div>
  );
}
