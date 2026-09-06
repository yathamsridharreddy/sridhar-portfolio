import { motion } from "framer-motion";
import {
  FaAws, FaPython, FaJava, FaGitAlt, FaLinux, FaHtml5,
  FaDocker, FaServer, FaJenkins, FaCloud, FaGears,
  FaDatabase, FaListCheck, FaCode,
} from "react-icons/fa6";
import SectionHeading from "./SectionHeading";
import Parallax from "./Parallax";
import { stagger, cardIn, viewport, dur, ease } from "../motion";

const categories = [
  {
    title: "Languages & Core Stack",
    skills: [
      { icon: <FaAws />, name: "AWS", color: "#FF9900" },
      { icon: <FaPython />, name: "Python", color: "#3776AB" },
      { icon: <FaJava />, name: "Java", color: "#ED8B00" },
      { icon: <FaGitAlt />, name: "Git & GitHub", color: "#F05032" },
      { icon: <FaLinux />, name: "C / C++", color: "#00599C" },
      { icon: <FaHtml5 />, name: "HTML & CSS", color: "#E34F26" },
    ],
  },
  {
    title: "DevOps & Cloud Tools",
    skills: [
      { icon: <FaDocker />, name: "Docker", color: "#2496ED" },
      { icon: <FaServer />, name: "Kubernetes", color: "#326CE5" },
      { icon: <FaJenkins />, name: "Jenkins", color: "#D33833" },
      { icon: <FaCloud />, name: "Terraform", color: "#7B42BC" },
      { icon: <FaGears />, name: "Ansible", color: "#EE0000" },
    ],
  },
  {
    title: "CS Fundamentals",
    skills: [
      { icon: <FaServer />, name: "Operating Systems", color: "#FCC624" },
      { icon: <FaDatabase />, name: "DBMS & SQL", color: "#4A90D9" },
      { icon: <FaListCheck />, name: "SDLC", color: "#4CAF50" },
      { icon: <FaCode />, name: "DSA", color: "#FF5722" },
    ],
  },
];

const marqueeSkills = categories.flatMap((c) => c.skills);

function Marquee() {
  // Two identical runs; the track shifts by exactly half its width.
  const run = [...marqueeSkills, ...marqueeSkills];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marqueeTrack">
        {run.map((s, i) => (
          <span className="marqueeItem" key={`${s.name}-${i}`}>
            {s.icon}
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function SkillCard({ skill }) {
  return (
    <motion.div
      className="skillCard"
      variants={cardIn}
      whileHover={{ y: -8, scale: 1.04 }}
      transition={{ duration: dur.fast, ease: ease.out }}
      style={{ "--skill": skill.color }}
    >
      <span className="skillBloom" aria-hidden="true" />
      <span className="skillIcon">{skill.icon}</span>
      <span className="skillName">{skill.name}</span>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="section skillsSection">
      <Parallax className="sectionGlow at-right" speed={-50} aria-hidden="true" />
      <SectionHeading eyebrow="What I work with" title="Skills" />

      {categories.map((category, i) => (
        <motion.div
          key={category.title}
          className="skillCategory"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: dur.base, ease: ease.out, delay: i * 0.08 }}
        >
          <h3 className="categoryTitle">
            <span className="categoryBar" />
            {category.title}
          </h3>

          <motion.div
            className="skillGrid"
            variants={stagger(0.05, 0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {category.skills.map((skill) => (
              <SkillCard key={skill.name} skill={skill} />
            ))}
          </motion.div>
        </motion.div>
      ))}

      <Marquee />
    </section>
  );
}
