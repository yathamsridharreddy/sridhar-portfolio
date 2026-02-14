import { motion } from "framer-motion";
import { FaBriefcase, FaCertificate, FaExternalLinkAlt } from "react-icons/fa";

const experience = {
  title: "Experience",
  items: [
    {
      role: "AWS Cloud Intern",
      company: "Technical Hub Pvt Ltd | Summer Internship",
      period: "May 2025 – June 2025",
      description: [
        "Architected and deployed secure AWS infrastructure by configuring EC2 instances within custom VPC networks, ensuring optimized connectivity and performance.",
        "Implemented IAM roles and access policies to enforce secure authentication and controlled server-level permissions.",
        "Built and tested cloud-based client–server models, gaining practical exposure to scalable architecture and real-world deployment strategies.",
      ],
      certImage: "/technical-hub-cert.pdf"
    },
  ],
};

export default function Experience() {
  return (
    <motion.section 
      id="experience"
      className="section experienceSection"
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
        {experience.title}
      </motion.h2>

      <div className="experienceContainer">
        {experience.items.map((item, index) => (
          <motion.div 
            key={index}
            className="experienceCard"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="experienceHeader">
              <div className="experienceRole">
                <h3>{item.role}</h3>
                <p className="experienceCompany">{item.company}</p>
              </div>
              <span className="experiencePeriod">{item.period}</span>
            </div>
            
            <ul className="experienceDescription">
              {item.description.map((desc, idx) => (
                <li key={idx}>{desc}</li>
              ))}
            </ul>

            {/* Certificate Button */}
            {item.certImage && (
              <div className="experienceCertContainer">
                <motion.a
                  href={item.certImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="experienceCertBtn"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaCertificate /> View Certificate <FaExternalLinkAlt />
                </motion.a>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

