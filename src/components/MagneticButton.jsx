import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * A control that leans toward the cursor while hovered, then springs back.
 * `as` picks the element ("a" for links, "button" for actions).
 * `strength` is the maximum lean in px.
 *
 * Movement is skipped entirely under reduced motion — the element still
 * renders and stays fully interactive.
 */
export default function MagneticButton({
  children,
  className = "",
  strength = 18,
  as = "a",
  ...rest
}) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });

  const onMove = (e) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * strength * 2);
    y.set(((e.clientY - r.top) / r.height - 0.5) * strength * 2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const Tag = motion[as] ?? motion.a;

  return (
    <Tag
      ref={ref}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={reduced ? undefined : { x: sx, y: sy }}
      whileHover={reduced ? undefined : { scale: 1.04 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
