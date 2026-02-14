import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";

const education = {
  title: "Education",
  items: [
    {
      institution: "Aditya College Of Engineering And Technology",
      period: "2023 – 2027",
      degree: "Bachelor of Technology in Computer Science",
      grade: "CGPA: 8.30",
    },
    {
      institution: "Bhashyam Junior College, Guntur",
      period: "2021 – 2023",
      degree: "Board of Intermediate Education Andhra Pradesh, MPC",
      grade: "Percentage: 9.47",
    },
  ],
};

export default function Education() {
  return (
    <motion.section 
      id="education"
      className="section educationSection"
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
        {education.title}
      </motion.h2>

      <div className="educationContainer">
        {education.items.map((item, index) => (
          <motion.div 
            key={index}
            className="educationCard"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 * index, duration: 0.5 }}
          >
            <div className="educationIcon">
              <FaGraduationCap />
            </div>
            <div className="educationContent">
              <h3>{item.institution}</h3>
              <p className="educationPeriod">{item.period}</p>
              <p className="educationDegree">{item.degree}</p>
              <span className="educationGrade">{item.grade}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

