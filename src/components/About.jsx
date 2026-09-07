import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import Parallax from "./Parallax";
import Counter from "./Counter";
import ScrollWords from "./ScrollWords";
import { stagger, viewport, popIn } from "../motion";

const intro = [
  { text: "I am a " },
  { text: "Cloud and DevOps focused Computer Science student", strong: true },
  {
    text:
      " passionate about building scalable and automated systems. I have hands-on experience with ",
  },
  { text: "AWS (EC2, RDS, S3)", strong: true },
  { text: ", " },
  { text: "Docker", strong: true },
  {
    text:
      ", and creating CI/CD pipelines. My goal is to build efficient and production-ready cloud systems.",
  },
];

const stats = [
  { value: 8.3, decimals: 2, label: "CGPA", suffix: "" },
  { value: 2, decimals: 0, label: "Cloud projects shipped", suffix: "" },
  { value: 3, decimals: 0, label: "Certifications earned", suffix: "" },
  { value: 300, decimals: 0, label: "Teams outranked at SIH", suffix: "+" },
];

export default function About() {
  return (
    <section id="about" className="section aboutSection">
      <Parallax className="sectionGlow at-left" speed={-45} aria-hidden="true" />
      <SectionHeading eyebrow="Who I am" title="About Me" />

      <div className="aboutIntro">
        <ScrollWords segments={intro} />
      </div>

      <motion.div
        className="statsGrid"
        variants={stagger(0.09, 0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {stats.map((s) => (
          <motion.div key={s.label} className="statCard" variants={popIn}>
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
