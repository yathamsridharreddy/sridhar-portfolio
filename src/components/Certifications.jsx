import { motion } from "framer-motion";
import { FaAws, FaCertificate } from "react-icons/fa";

const certifications = [ 
  { 
    badge: "AWS",
    icon: <FaAws />, 
    title: "AWS Academy Graduate - Cloud Developing", 
    org: "Amazon Web Services",
    desc: "Certified in building cloud applications on AWS infrastructure",
    certImage: "/aws-cloud-developing-cert.pdf",
    badgeImage: "/aws-academy-badge.png"
  },
  { 
    badge: "HTML/CSS",
    icon: <FaCertificate />, 
    title: "IT Specialist - HTML and CSS", 
    org: "Certiport",
    desc: "Certified in web development fundamentals",
    certImage: "/html-css-cert.pdf",
    badgeImage: "/html-css-badge.png"
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

import { useState } from "react";

export default function Certifications() {
  const [selectedCert, setSelectedCert] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);

  return (
    <motion.section 
      id="certifications"
      className="section certificationsSection"
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
        Certifications
      </motion.h2>

      {/* Certification Cards */}
      <motion.div
        className="certificationsGrid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {certifications.map((cert, i) => (
          <motion.div 
            key={i} 
            className={`certificationCard ${selectedCert === i ? 'selected' : ''}`}
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCert(selectedCert === i ? null : i)}
            style={{ cursor: 'pointer' }}
          >
            <motion.div 
              className="certificationIcon"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              {cert.icon}
            </motion.div>
            <div className="certificationContent">
              <h3>{cert.title}</h3>
              <span className="certOrg">{cert.org}</span>
              <p>{cert.desc}</p>
              {cert.badgeImage && (
                <motion.button
                  className="badge-view-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBadge(cert.badgeImage);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #FF9900, #FFB84D)',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaAws /> View Badge
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Certificate Modal */}
      {selectedCert !== null && (
        <motion.div 
          className="certModal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedCert(null)}
        >
          <motion.div 
            className="certModalContent"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="certClose" onClick={() => setSelectedCert(null)}>×</button>
            {certifications[selectedCert].certImage.endsWith('.pdf') ? (
              <div className="certPdfContainer">
                <a 
                  href={certifications[selectedCert].certImage} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="certPdfLink"
                >
                  Open Certificate (PDF)
                </a>
              </div>
            ) : (
              <img 
                src={certifications[selectedCert].certImage} 
                alt={certifications[selectedCert].title}
                className="certImage"
              />
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Badge Modal */}
      {selectedBadge && (
        <motion.div 
          className="certModal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedBadge(null)}
        >
          <motion.div 
            className="certModalContent"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '400px' }}
          >
            <button className="certClose" onClick={() => setSelectedBadge(null)}>×</button>
            <img 
              src={selectedBadge} 
              alt="Certification Badge"
              className="certImage"
              style={{ padding: '1rem' }}
            />
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  );
}

