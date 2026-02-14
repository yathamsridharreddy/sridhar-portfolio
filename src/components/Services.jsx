import { useState } from "react";
import { motion } from "framer-motion";
import { FaCloud, FaDocker, FaRobot, FaCode, FaServer, FaBrain } from "react-icons/fa";

const services = [
  { 
    icon: <FaCloud />, 
    title: "Cloud Deployment",
    back: "AWS, Azure & GCP expertise with scalable infrastructure design"
  },
  { 
    icon: <FaDocker />, 
    title: "DevOps & CI/CD",
    back: "Automated pipelines using Docker, Jenkins & GitHub Actions"
  },
  { 
    icon: <FaRobot />, 
    title: "AI Automation",
    back: "Intelligent automation solutions leveraging AI/ML technologies"
  },
  { 
    icon: <FaCode />, 
    title: "Cloud Development",
    back: "Serverless applications with AWS Lambda & API Gateway"
  },
  { 
    icon: <FaServer />, 
    title: "Infrastructure as Code",
    back: "Terraform & CloudFormation for reproducible deployments"
  },
  { 
    icon: <FaBrain />, 
    title: "MLOps",
    back: "End-to-end machine learning pipeline automation"
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

function FlipCard({ service }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      className="flipCardContainer"
      onClick={() => setFlipped(!flipped)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="flipCard"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <motion.div 
          className="flipCardFront"
          style={{ backfaceVisibility: "hidden" }}
        >
          <motion.div
            className="flipCardIcon"
            whileHover={{ scale: 1.15, rotate: 10 }}
            transition={{ duration: 0.3 }}
          >
            {service.icon}
          </motion.div>
          <h3>{service.title}</h3>
          <p className="flipHint">Tap to learn more</p>
        </motion.div>

        {/* Back */}
        <motion.div 
          className="flipCardBack"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <p>{service.back}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Services() {
  return (
    <motion.section 
      id="services"
      className="section"
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
        Services
      </motion.h2>

      <motion.div 
        className="serviceGrid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {services.map((s, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
          >
            <FlipCard service={s} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

