import { motion } from "framer-motion";
import { FaCode, FaPython, FaHackerrank } from "react-icons/fa";

const codingProfiles = [
  { name: "CodeChef", href: "https://www.codechef.com/users/yathamsridharr", icon: <FaCode />, color: "#DDAA33", gradient: "linear-gradient(135deg, #ffffff 0%, #8B4513 100%)" },
  { name: "LeetCode", href: "https://leetcode.com/u/yathamsridharreddy/", icon: <FaPython />, color: "#FFA116", gradient: "linear-gradient(135deg, #FFA116 0%, #ffffff 100%)" },
  { name: "HackerRank", href: "https://www.hackerrank.com/profile/yathamsridhar", icon: <FaHackerrank />, color: "#00EA64", gradient: "linear-gradient(135deg, #00EA64 0%, #1a472a 100%)" }
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5
    }
  })
};

export default function CodingProfiles() {
  return (
    <motion.section 
      id="coding-profiles"
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
        Coding Profiles
      </motion.h2>
      
      <motion.div
        className="coding-links"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}
      >
        {codingProfiles.map((profile, i) => (
          <motion.a
            key={i}
            href={profile.href}
            target="_blank"
            rel="noopener noreferrer"
            custom={i}
            variants={itemVariants}
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '0.75rem 1.5rem',
              background: profile.gradient,
              border: `2px solid ${profile.color}`,
              borderRadius: '12px',
              color: profile.name === 'CodeChef' ? '#8B4513' : profile.name === 'LeetCode' ? '#ffffff' : '#ffffff',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: `0 4px 15px ${profile.color}40`,
            }}
          >
            <span style={{ fontSize: '1.4rem', color: profile.name === 'CodeChef' ? '#8B4513' : profile.name === 'LeetCode' ? '#ffffff' : '#ffffff' }}>{profile.icon}</span>
            {profile.name}
          </motion.a>
        ))}
      </motion.div>
    </motion.section>
  );
}

