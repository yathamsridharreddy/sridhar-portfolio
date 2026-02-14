import { motion } from "framer-motion";
import {
  FaAws, FaPython, FaJava, FaGithub, FaLinux, FaHtml5, FaCss3,
  FaDocker, FaServer, FaJenkins, FaCode, FaTasks, FaDatabase,
  FaCloud, FaCogs
} from "react-icons/fa";

const categories = [
  {
    title: "Languages & Core Stack",
    skills: [
      { icon: <FaAws />, name: "AWS", color: "#FF9900" },
      { icon: <FaPython />, name: "Python", color: "#3776AB" },
      { icon: <FaJava />, name: "Java", color: "#ED8B00" },
      { icon: <FaGithub />, name: "Git & GitHub", color: "#181717" },
      { icon: <FaLinux />, name: "C/C++", color: "#00599C" },
      { icon: <FaHtml5 />, name: "HTML & CSS", color: "#E34F26" }
    ]
  },
  {
    title: "DevOps & Cloud Tools",
    skills: [
      { icon: <FaDocker />, name: "Docker", color: "#2496ED" },
      { icon: <FaServer />, name: "Kubernetes", color: "#326CE5" },
      { icon: <FaJenkins />, name: "Jenkins", color: "#D33833" },
      { icon: <FaCloud />, name: "Terraform", color: "#7B42BC" },
      { icon: <FaCogs />, name: "Ansible", color: "#EE0000" }
    ]
  },
  {
    title: "CS Fundamentals",
    skills: [
      { icon: <FaServer />, name: "OS", color: "#FCC624" },
      { icon: <FaDatabase />, name: "DBMS & SQL", color: "#336791" },
      { icon: <FaTasks />, name: "SDLC", color: "#4CAF50" },
      { icon: <FaCode />, name: "DSA", color: "#FF5722" }
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15
    }
  }
};

function SkillIcon({ skill, index }) {
  return (
    <motion.div
      className="skillIconCard"
      variants={itemVariants}
      custom={index}
      whileHover={{ 
        scale: 1.15, 
        y: -10,
        rotate: [0, -3, 3, 0]
      }}
      style={{ "--skill-color": skill.color }}
    >
      <motion.div
        className="skillIconWrapper"
        animate={{ 
          rotate: [0, 360],
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="skillIconInner">
          {skill.icon}
        </div>
      </motion.div>
      <span className="skillName" style={{ color: skill.color }}>{skill.name}</span>
      <motion.div 
        className="skillGlow"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />
    </motion.div>
  );
}

export default function Skills() {
  return (
    <motion.section 
      id="skills"
      className="section skillsSection"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.div
        className="skillsBackground"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      />
      
      <motion.h2
        className="skillsTitle"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        Skills
        <motion.span 
          className="skillsTitleUnderline"
          layoutId="underline"
        />
      </motion.h2>

      {categories.map((category, catIndex) => (
        <motion.div
          key={catIndex}
          className="skillCategory"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: catIndex * 0.15, duration: 0.5 }}
        >
          <motion.h3
            className="categoryTitle"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: catIndex * 0.15 + 0.1 }}
          >
            {category.title}
          </motion.h3>
          
          <motion.div 
            className="skillIconsGrid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {category.skills.map((skill, i) => (
              <SkillIcon key={i} skill={skill} index={i} />
            ))}
          </motion.div>
        </motion.div>
      ))}
    </motion.section>
  );
}

