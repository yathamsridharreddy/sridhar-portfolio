import { motion } from "framer-motion";

export default function About() {
  return (
    <motion.section 
      id="about"
      className="section aboutSection"
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
        About Me
      </motion.h2>

      <motion.div 
        className="aboutIntro"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <p>
          I am a <strong>Cloud and DevOps focused Computer Science student</strong> passionate about building scalable 
          and automated systems. I have hands-on experience with <strong>AWS (EC2, RDS, S3)</strong>, <strong>Docker</strong>, 
          and creating CI/CD pipelines. My goal is to build efficient and production-ready cloud systems.
        </p>
      </motion.div>

    </motion.section>
  );
}

