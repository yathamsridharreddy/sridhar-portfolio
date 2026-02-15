import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectModal from "./ProjectModal";
import arch1 from "../assets/aws-arch1.png";
import arch2 from "../assets/aws-arch2.png";

const projects = [
  {
    title: "CodeSync",
    desc: "Flask + AWS SNS notification automation",
    arch: arch1,
    images: [
      "/project2-image1.jpeg",
      "/project2-image2.jpeg",
      "/project2-image3.jpeg",
      "/project2-image4.jpeg"
    ],
    link: "https://github.com/yathamsridharreddy/aws-cloud-projects/tree/main/CodeSync"
  },
  {
    title: "CloudSmiths",
    desc: "EC2 + RDS + S3 + Docker scalable platform",
    arch: arch2,
    images: [
      "/project-image1.jpeg",
      "/project-image2.jpeg",
      "/project-image3.jpeg",
      "/project-image4.jpeg"
    ],
    link: "https://github.com/yathamsridharreddy/aws-cloud-projects/tree/main/CloudSmiths"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export default function Projects() {
  const [selected, setSelected] = useState(null);

  return (
    <motion.section 
      id="projects"
      className="section"
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
        Projects
      </motion.h2>

      <motion.div 
        className="projectsGrid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {projects.map((p, i) => (
          <motion.div 
            key={i} 
            className="card"
            onClick={() => setSelected(p)}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.03,
              y: -5,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            layoutId={`project-${i}`}
          >
            <motion.h3 layoutId={`title-${i}`}>{p.title}</motion.h3>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selected && (
          <ProjectModal 
            project={selected} 
            close={() => setSelected(null)} 
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}
