import { motion } from "framer-motion";
import { ease, dur, viewport, wordRise, stagger } from "../motion";

/**
 * Section heading. The title is split into words, each rising out of its own
 * mask on a stagger, so long titles read as a sequence rather than one block.
 * `eyebrow` is the small label above the title.
 */
export default function SectionHeading({ eyebrow, title, align = "center" }) {
  const words = String(title).split(" ");

  return (
    <div className={`sectionHeading align-${align}`}>
      {eyebrow && (
        <motion.span
          className="sectionEyebrow"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: dur.base, ease: ease.out }}
        >
          {eyebrow}
        </motion.span>
      )}

      <motion.h2
        className="sectionTitle"
        variants={stagger(0.08, 0.05)}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {words.map((word, i) => (
          <span className="maskLine" key={`${word}-${i}`}>
            <motion.span className="maskInner" variants={wordRise}>
              {word}
            </motion.span>
          </span>
        ))}
      </motion.h2>

      <motion.span
        className="sectionRule"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={viewport}
        transition={{ duration: dur.slow, ease: ease.out, delay: 0.2 }}
      />
    </div>
  );
}
