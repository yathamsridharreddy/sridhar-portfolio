import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaGithub, FaLinkedin, FaPhone, FaPaperPlane, FaSpinner } from "react-icons/fa";

const contactInfo = [
  { icon: <FaEnvelope />, text: "yathamsridharreddy99@gmail.com", href: "mailto:yathamsridharreddy99@gmail.com" },
  { icon: <FaGithub />, text: "github.com/yathamsridharreddy", href: "https://github.com/yathamsridharreddy" },
  { icon: <FaLinkedin />, text: "linkedin.com/in/yatham-sridhar-reddy", href: "https://www.linkedin.com/in/yatham-sridhar-reddy-744177374/" },
  { icon: <FaPhone />, text: "+91 7207580938", href: "tel:+917207580938" }
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

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("https://formspree.io/f/xkovjayq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        // Auto-dismiss success message after 5 seconds
        setTimeout(() => {
          setStatus(null);
        }, 5000);
      } else {
        setStatus("error");
        // Auto-dismiss error message after 5 seconds
        setTimeout(() => {
          setStatus(null);
        }, 5000);
      }
    } catch (error) {
      setStatus("error");
      // Auto-dismiss error message after 5 seconds
      setTimeout(() => {
        setStatus(null);
      }, 5000);
    }
  };

  return (
    <motion.section 
      id="contact"
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
        Contact
      </motion.h2>

      <motion.div 
        className="contact-info"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {contactInfo.map((info, i) => (
          <motion.p 
            key={i}
            custom={i}
            variants={itemVariants}
          >
            <motion.a 
              href={info.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                color: 'inherit'
              }}
            >
              <motion.span
                animate={{ 
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3
                }}
              >
                {info.icon}
              </motion.span>
              {info.text}
            </motion.a>
          </motion.p>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ marginTop: '2rem' }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ fontSize: '1.1rem', marginBottom: '1rem' }}
        >
          Ready to collaborate on cloud & DevOps projects?
        </motion.p>
      </motion.div>

      <motion.div
        className="contact-form"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7 }}
      >
        <motion.h3
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          Message Me
        </motion.h3>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.85 }}
          style={{ marginBottom: '1.5rem', opacity: 0.9 }}
        >
          I'm actively seeking new opportunities. Whether you have a question or just want to say hi, my inbox is always open!
        </motion.p>

        <form onSubmit={handleSubmit}>
          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
          >
            <label htmlFor="name">Your Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder=""
              value={formData.name}
              onChange={handleChange}
              required
            />
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.0 }}
          >
            <label htmlFor="email">Your Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.1 }}
          >
            <label htmlFor="message">Your Message</label>
            <textarea 
              id="message" 
              name="message" 
              rows="5"
              placeholder="I'd love to chat about..."
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </motion.div>

          <AnimatePresence mode="wait">
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{ 
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)",
                color: "white",
                padding: "1.5rem 2rem",
                borderRadius: "16px",
                marginBottom: "1rem",
                textAlign: "center",
                boxShadow: "0 8px 32px rgba(139, 92, 246, 0.4), 0 0 0 2px rgba(139, 92, 246, 0.2)",
                border: "2px solid rgba(255, 255, 255, 0.3)"
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                style={{ 
                  fontSize: "1.25rem", 
                  fontWeight: "700",
                  marginBottom: "0.5rem",
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }}
              >
                ✉️ Message Sent Successfully!
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ 
                  fontSize: "1rem",
                  fontWeight: "500",
                  opacity: 0.95
                }}
              >
                💬 I'll get back to you soon.
              </motion.div>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ color: "#ef4444", marginBottom: "1rem", textAlign: "center" }}
            >
              Something went wrong. Please try again.
            </motion.div>
          )}
          </AnimatePresence>

          <motion.button
            type="submit"
            className="send-button"
            whileHover={{ scale: status === "submitting" ? 1 : 1.05 }}
            whileTap={{ scale: status === "submitting" ? 1 : 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2 }}
            disabled={status === "submitting"}
            style={{ 
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              cursor: status === "submitting" ? "not-allowed" : "pointer",
              opacity: status === "submitting" ? 0.7 : 1
            }}
          >
            {status === "submitting" ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ display: "inline-block" }}
                >
                  <FaSpinner />
                </motion.span>
                Sending...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Send Message
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.section>
  );
}

