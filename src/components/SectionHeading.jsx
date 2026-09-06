import { motion } from "framer-motion";
import { ease, dur, viewport } from "../motion";

/**
 * Section heading with a masked rise and a rule that draws itself.
 * `eyebrow` is the small label above the title.
 */
export default function SectionHeading({ eyebrow, title, align = "center" }) {
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

      <h2 className="sectionTitle">
        <span className="maskLine">
          <motion.span
            className="maskInner"
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={viewport}
            transition={{ duration: dur.slow, ease: ease.out, delay: 0.05 }}
          >
            {title}
          </motion.span>
        </span>
      </h2>

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
