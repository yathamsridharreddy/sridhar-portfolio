import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ease, dur } from "../motion";

const LETTERS = "SRIDHAR".split("");

export default function Preloader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Skip entirely for reduced-motion users.
    if (reduced) {
      setDone(true);
      document.body.classList.remove("is-loading");
      return;
    }
    document.body.classList.add("is-loading");
    const t = setTimeout(() => setDone(true), 1500);
    return () => clearTimeout(t);
  }, [reduced]);

  useEffect(() => {
    if (done) document.body.classList.remove("is-loading");
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="preloader"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: ease.inOut }}
        >
          <div className="preloaderInner">
            <div className="preloaderWord">
              {LETTERS.map((letter, i) => (
                <span key={i} className="preloaderMask">
                  <motion.span
                    className="preloaderLetter"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{
                      duration: dur.slow,
                      ease: ease.out,
                      delay: 0.1 + i * 0.06,
                    }}
                  >
                    {letter}
                  </motion.span>
                </span>
              ))}
            </div>

            <motion.div
              className="preloaderBar"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, ease: ease.inOut, delay: 0.15 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
