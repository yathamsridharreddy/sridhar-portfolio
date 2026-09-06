import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import Counter from "./Counter";
import { fadeUp, stagger, viewport, cardIn } from "../motion";

const stats = [
  { value: 8.3, decimals: 2, label: "CGPA", suffix: "" },
  { value: 2, decimals: 0, label: "Cloud projects shipped", suffix: "" },
  { value: 3, decimals: 0, label: "Certifications earned", suffix: "" },
  { value: 300, decimals: 0, label: "Teams outranked at SIH", suffix: "+" },
];

export default function About() {
  return (
    <section id="about" className="section aboutSection">
      <SectionHeading eyebrow="Who I am" title="About Me" />

      <motion.div
        className="aboutIntro"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <p>
          I am a <strong>Cloud and DevOps focused Computer Science student</strong>{" "}
          passionate about building scalable and automated systems. I have
          hands-on experience with <strong>AWS (EC2, RDS, S3)</strong>,{" "}
          <strong>Docker</strong>, and creating CI/CD pipelines. My goal is to
          build efficient and production-ready cloud systems.
        </p>
      </motion.div>

      <motion.div
        className="statsGrid"
        variants={stagger(0.09, 0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {stats.map((s) => (
          <motion.div key={s.label} className="statCard" variants={cardIn}>
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
