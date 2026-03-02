import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import profile from "../assets/profile1.jpg";

const itemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <motion.img 
        src={profile} 
        alt="Yatham Sridhar Reddy" 
        className="profilePic"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      />

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Yatham Sridhar Reddy
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <TypeAnimation
          sequence={[
            "Cloud Engineer",
            1500,
            "DevOps Engineer",
            1500,
            "AWS Developer",
            1500,
          ]}
          repeat={Infinity}
          className="typing"
        />
      </motion.div>

      <motion.div
        className="heroButtons"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <motion.a 
          href="/sridhar_final-resume.pdf" 
          download 
          className="resumeBtn"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Download Resume
        </motion.a>
        
        <motion.a 
          href="#contact" 
          className="hireMeBtn"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
Let's Connect
        </motion.a>
      </motion.div>
    </section>
  );
}
