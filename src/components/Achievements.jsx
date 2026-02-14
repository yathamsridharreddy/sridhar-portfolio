import { motion } from "framer-motion";
import { FaTrophy, FaMedal } from "react-icons/fa";

const achievements = [
  { 
    icon: <FaTrophy />, 
    title: "Smart India Hackathon (SIH) – Internal Hackathon Finalist",
    description: "Ranked Top 50 out of 300+ teams (Top 16%) in the campus internal round by developing and pitching an innovative, scalable real-world solution, demonstrating strong problem-solving, teamwork, rapid prototyping, and technical presentation skills.",
    ariaLabel: "Smart India Hackathon"
  },
  { 
    icon: <FaMedal />, 
    title: "GeeksforGeeks HackSprint",
    description: "Secured 6th position out of 150+ teams by designing and delivering a fully functional solution under strict time constraints, recognized for technical excellence, innovation, and impactful presentation.",
    ariaLabel: "GeeksforGeeks HackSprint"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.85 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20
    }
  }
};

export default function Achievements() {
  return (
    <motion.section 
      id="achievements"
      className="section achievementsSection"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Achievements
      </motion.h2>

      <motion.div 
        className="achievementsGrid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {achievements.map((item, i) => (
          <motion.div 
            key={i} 
            className="achievementCard"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
          >
            <motion.span 
              className="achievementIcon"
              aria-label={item.ariaLabel}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
            >
              {item.icon}
            </motion.span>
            <div className="achievementContent">
              <span className="achievementTitle">{item.title}</span>
              <span className="achievementDescription">{item.description}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

