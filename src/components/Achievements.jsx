import { motion } from "framer-motion";
import { FaTrophy, FaMedal } from "react-icons/fa6";
import SectionHeading from "./SectionHeading";
import Parallax from "./Parallax";
import Counter from "./Counter";
import { viewport, stagger, cardIn, dur, ease } from "../motion";

const achievements = [
  {
    icon: <FaTrophy />,
    accent: "#f59e0b",
    title: "Smart India Hackathon — Internal Finalist",
    rank: { value: 50, prefix: "Top ", suffix: "" },
    context: "of 300+ teams",
    description:
      "Ranked in the top 16% at the campus internal round by developing and pitching an innovative, scalable real-world solution — demonstrating problem-solving, teamwork, rapid prototyping and technical presentation.",
  },
  {
    icon: <FaMedal />,
    accent: "#22d3ee",
    title: "GeeksforGeeks HackSprint",
    rank: { value: 6, prefix: "#", suffix: "" },
    context: "of 150+ teams",
    description:
      "Secured 6th position by designing and delivering a fully functional solution under strict time constraints, recognised for technical excellence, innovation and impactful presentation.",
  },
];

export default function Achievements() {
  return (
    <section id="achievements" className="section achievementsSection">
      <Parallax className="sectionGlow at-left" speed={-45} aria-hidden="true" />
      <SectionHeading eyebrow="Recognition" title="Achievements" />

      <motion.div
        className="achievementsGrid"
        variants={stagger(0.12, 0.05)}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {achievements.map((a) => (
          <motion.article
            key={a.title}
            className="achievementCard"
            variants={cardIn}
            style={{ "--accent": a.accent }}
            whileHover={{ y: -6 }}
            transition={{ duration: dur.fast, ease: ease.out }}
          >
            <span className="achievementGlow" aria-hidden="true" />

            <div className="achievementTop">
              <span className="achievementIcon">{a.icon}</span>
              <div className="achievementRank">
                <Counter
                  className="rankValue"
                  value={a.rank.value}
                  prefix={a.rank.prefix}
                  suffix={a.rank.suffix}
                />
                <span className="rankContext">{a.context}</span>
              </div>
            </div>

            <h3 className="achievementTitle">{a.title}</h3>
            <p className="achievementDescription">{a.description}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
