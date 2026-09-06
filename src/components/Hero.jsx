import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import MagneticButton from "./MagneticButton";
import { FaArrowDown, FaFileArrowDown, FaPaperPlane } from "react-icons/fa6";
import profile from "../assets/profile1.webp";
import { ease, dur } from "../motion";

/** Button that leans toward the cursor. */
const NAME = "Yatham Sridhar Reddy";

export default function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  const words = NAME.split(" ");

  return (
    <section id="hero" className="hero" ref={ref}>
      {/* Aurora mesh background */}
      <div className="heroAurora" aria-hidden="true">
        <span className="auroraBlob blob1" />
        <span className="auroraBlob blob2" />
        <span className="auroraBlob blob3" />
      </div>
      <div className="heroGrid" aria-hidden="true" />

      <motion.div
        className="heroInner"
        style={reduced ? undefined : { y, opacity, scale }}
      >
        {/* Photo with rotating conic ring */}
        <motion.div
          className="profileWrap"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: dur.slow, ease: ease.out }}
        >
          <span className="profileRing" aria-hidden="true" />
          <span className="profileHalo" aria-hidden="true" />
          <motion.img
            src={profile}
            alt="Yatham Sridhar Reddy"
            className="profilePic"
            width="440"
            height="440"
            fetchpriority="high"
            decoding="async"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: dur.fast, ease: ease.out }}
          />
        </motion.div>

        <motion.span
          className="heroAvailable"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.base, ease: ease.out, delay: 0.15 }}
        >
          <span className="availableDot" />
          Open to Cloud &amp; DevOps roles
        </motion.span>

        {/* Name, revealed word by word from behind a mask */}
        <h1 className="heroName">
          {words.map((word, i) => (
            <span className="maskLine" key={i}>
              <motion.span
                className="maskInner"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: dur.slower,
                  ease: ease.out,
                  delay: 0.25 + i * 0.09,
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          className="heroRole"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: dur.base, delay: 0.7 }}
        >
          <TypeAnimation
            sequence={[
              "Cloud Engineer",
              1600,
              "DevOps Engineer",
              1600,
              "AWS Developer",
              1600,
            ]}
            repeat={Infinity}
            className="typing"
            cursor
          />
        </motion.div>

        <motion.p
          className="heroTagline"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.base, ease: ease.out, delay: 0.8 }}
        >
          I build scalable, automated infrastructure on AWS — from CI/CD
          pipelines to containerised, production-ready deployments.
        </motion.p>

        <motion.div
          className="heroButtons"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.base, ease: ease.out, delay: 0.9 }}
        >
          <MagneticButton
            href="/sridhar_final-resume.pdf"
            download="Yatham_Sridhar_Reddy_Resume.pdf"
            className="btn btnPrimary"
          >
            <FaFileArrowDown />
            Download Resume
          </MagneticButton>

          <MagneticButton href="#contact" className="btn btnGhost">
            <FaPaperPlane />
            Let&apos;s Connect
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        className="scrollCue"
        aria-label="Scroll to About"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: dur.base }}
      >
        <span className="scrollCueTrack">
          <motion.span
            className="scrollCueDot"
            animate={reduced ? {} : { y: [0, 14, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        <FaArrowDown />
      </motion.a>
    </section>
  );
}
