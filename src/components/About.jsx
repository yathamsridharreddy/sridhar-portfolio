import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import Parallax from "./Parallax";
import Counter from "./Counter";
import { stagger, viewport, popIn } from "../motion";

const intro = [
  { text: "I am a " },
  { text: "Full-Stack Software Developer", strong: true },
  { text: " with a " },
  { text: "Cloud and DevOps", strong: true },
  {
    text:
      " specialisation. I build the whole path an application takes: React front ends, ",
  },
  { text: "Spring Boot and Node.js", strong: true },
  {
    text:
      " services behind them, and the infrastructure they run on. That has meant a multi-cloud comparison platform on ",
  },
  { text: "AWS (S3, API Gateway, EC2, RDS)", strong: true },
  {
    text:
      " provisioned with Terraform and shipped through Jenkins, and a real-time multiplayer game on an authoritative ",
  },
  { text: "WebSocket", strong: true },
  { text: " relay. My goal is to build production-ready systems end to end." },
];

const stats = [
  { value: 8.3, decimals: 2, label: "CGPA", suffix: "" },
  { value: 2, decimals: 0, label: "Cloud projects shipped", suffix: "" },
  { value: 3, decimals: 0, label: "Certifications earned", suffix: "" },
  { value: 300, decimals: 0, label: "Teams outranked at SIH", suffix: "+" },
];

export default function About() {
  const reduced = useReducedMotion();
  return (
    <section id="about" className="section aboutSection">
      <Parallax className="sectionGlow at-left" speed={-45} aria-hidden="true" />
      <SectionHeading eyebrow="Who I am" title="About Me" />

      <div className="aboutIntro">
        <p>
          {intro.map((seg, i) =>
            seg.strong ? (
              <strong key={i}>{seg.text}</strong>
            ) : (
              <span key={i}>{seg.text}</span>
            )
          )}
        </p>
      </div>

      <motion.div
        className="statsGrid"
        variants={stagger(0.09, 0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            className="statCard"
            variants={popIn}
            whileHover={reduced ? undefined : { y: -6 }}
          >
            <Counter
              className="statValue"
              value={s.value}
              decimals={s.decimals}
              suffix={s.suffix}
            />
            <span className="statLabel">{s.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
