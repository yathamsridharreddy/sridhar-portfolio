import { motion } from "framer-motion";

const items = [
  "Built a Solid Foundation in Linux and Cloud Technologies",
  "Developed CodeSync – A coding activity automation system with AWS SNS integration",
  "Developed CloudSmiths – A cloud-based platform deployed on AWS with Docker",
  "Currently Advancing Toward AWS Developer Certification"
];

const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5
    }
  })
};

export default function Timeline() {
  return (
    <motion.section 
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
        Journey
      </motion.h2>

      {items.map((t, i) => (
        <motion.div 
          key={i} 
          className="timelineItem"
          custom={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        >
          {t}
        </motion.div>
      ))}
    </motion.section>
  );
}
