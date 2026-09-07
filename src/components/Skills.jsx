import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useInView,
  useReducedMotion,
  wrap,
} from "framer-motion";
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

// Percent of the track travelled per second at rest. Two copies means a full
// loop is 50%, so this matches the ~38s cycle the CSS animation used to run.
const BASE_VELOCITY = -1.35;

/**
 * Skills ticker that reacts to the page.
 *
 * At rest it drifts at a constant speed. While the user scrolls it speeds up
 * in proportion to scroll velocity, flips direction to match the way they are
 * scrolling, and skews very slightly into the movement. The result is that the
 * strip feels attached to the page rather than looping past it.
 */
function Marquee() {
  const reduced = useReducedMotion();
  const run = [...marqueeSkills, ...marqueeSkills];

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  });
  const skewX = useTransform(smoothVelocity, [-2500, 0, 2500], [5, 0, -5], {
    clamp: true,
  });

  // Two copies, so wrapping at -50% lands exactly on a seam.
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  const directionRef = useRef(1);
  const pausedRef = useRef(false);
  const trackRef = useRef(null);
  // The old CSS animation ran forever. A rAF loop doing the same would burn
  // cycles while the strip is nowhere near the screen, so gate it on view.
  const inView = useInView(trackRef, { margin: "200px" });

  useAnimationFrame((_, delta) => {
    if (reduced || pausedRef.current || !inView) return;

    let moveBy = directionRef.current * BASE_VELOCITY * (delta / 1000);

    const factor = velocityFactor.get();
    if (factor < 0) directionRef.current = -1;
    else if (factor > 0) directionRef.current = 1;

    moveBy += directionRef.current * moveBy * Math.abs(factor);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      className="marquee"
      ref={trackRef}
      aria-hidden="true"
      onPointerEnter={() => {
        pausedRef.current = true;
      }}
      onPointerLeave={() => {
        pausedRef.current = false;
      }}
    >
      <motion.div
        className="marqueeTrack"
        style={reduced ? undefined : { x, skewX }}
      >
        {run.map((s, i) => (
          <span className="marqueeItem" key={`${s.name}-${i}`}>
            {s.icon}
            {s.name}
          </span>
        ))}
      </motion.div>
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
