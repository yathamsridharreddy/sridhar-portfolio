import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Text that lights up word by word as you scroll through it.
 *
 * Unlike the rest of the site, this is scroll-LINKED rather than
 * scroll-triggered: nothing fires once and finishes. Each word's opacity is
 * mapped to a slice of the container's scroll progress, so the sentence
 * resolves under the reader and reverses if they scroll back up.
 *
 * `segments` is an array of { text, strong } so emphasis survives the split
 * into words. Rendering stays inline, so nothing here can shift layout.
 */

function Word({ text, strong, progress, range }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span className="scrollWord" style={{ opacity }}>
      {strong ? <strong>{text}</strong> : text}{" "}
    </motion.span>
  );
}

export default function ScrollWords({ segments, className = "" }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  // Start once the paragraph is well into view and finish before it leaves,
  // so the last word is lit while the text is still comfortably on screen.
  const { scrollYProgress } = useScroll({
    target: ref,
    // Finishes while the paragraph is still well inside the viewport. If a
    // visitor jumps straight to #about via the nav and stops, progress is
    // already 1 and every word is lit rather than stranded half-dim.
    offset: ["start 0.95", "end 0.7"],
  });

  const words = [];
  segments.forEach((seg, si) => {
    seg.text
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w, wi) => {
        words.push({ text: w, strong: !!seg.strong, key: `${si}-${wi}` });
      });
  });

  if (reduced) {
    return (
      <p className={className}>
        {segments.map((seg, i) =>
          seg.strong ? <strong key={i}>{seg.text}</strong> : <span key={i}>{seg.text}</span>
        )}
      </p>
    );
  }

  const step = 1 / words.length;

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word
          key={w.key}
          text={w.text}
          strong={w.strong}
          progress={scrollYProgress}
          // Overlap each word with the next so the sweep reads as a wave
          // rather than a row of individual switches.
          range={[i * step, Math.min(1, (i + 3) * step)]}
        />
      ))}
    </p>
  );
}
