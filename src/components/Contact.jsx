import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope, FaGithub, FaLinkedin, FaPhone, FaPaperPlane, FaCircleCheck,
} from "react-icons/fa6";
import SectionHeading from "./SectionHeading";
import Parallax from "./Parallax";
import { viewport, stagger, cardIn, dur, ease, spring } from "../motion";

const contactInfo = [
  {
    icon: <FaEnvelope />,
    label: "Email",
    text: "yathamsridharreddy99@gmail.com",
    href: "mailto:yathamsridharreddy99@gmail.com",
    external: false,
  },
  {
    icon: <FaGithub />,
    label: "GitHub",
    text: "yathamsridharreddy",
    href: "https://github.com/yathamsridharreddy",
    external: true,
  },
  {
    icon: <FaLinkedin />,
    label: "LinkedIn",
    text: "yatham-sridhar-reddy",
    href: "https://www.linkedin.com/in/yatham-sridhar-reddy-744177374/",
    external: true,
  },
  {
    icon: <FaPhone />,
    label: "Phone",
    text: "+91 7207580938",
    href: "tel:+917207580938",
    external: false,
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("https://formspree.io/f/xkovjayq", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus(null), 5000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <section id="contact" className="section contactSection">
      <Parallax className="sectionGlow at-right" speed={-50} aria-hidden="true" />
      <SectionHeading eyebrow="Say hello" title="Contact" />

      <div className="contactLayout">
        <motion.div
          className="contactCards"
          variants={stagger(0.08, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.p className="contactLead" variants={cardIn}>
            I&apos;m actively seeking cloud and DevOps opportunities. Whether you
            have a question or just want to say hi, my inbox is always open.
          </motion.p>

          {contactInfo.map((c) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noopener noreferrer" : undefined}
              className="contactCard"
              variants={cardIn}
              whileHover={{ x: 6 }}
              transition={{ duration: dur.fast, ease: ease.out }}
            >
              <span className="contactIcon">{c.icon}</span>
              <span className="contactText">
                <span className="contactLabel">{c.label}</span>
                <span className="contactValue">{c.text}</span>
              </span>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          className="contactForm"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: dur.slow, ease: ease.out }}
        >
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                className="formSuccess"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={spring.base}
              >
                <motion.span
                  className="successIcon"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ ...spring.bouncy, delay: 0.1 }}
                >
                  <FaCircleCheck />
                </motion.span>
                <h3>Message sent</h3>
                <p>Thanks for reaching out — I&apos;ll get back to you soon.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="formTitle">Message Me</h3>

                <div className="field">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={change}
                    placeholder=" "
                    required
                  />
                  <label htmlFor="name">Your name</label>
                </div>

                <div className="field">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={change}
                    placeholder=" "
                    required
                  />
                  <label htmlFor="email">Your email</label>
                </div>

                <div className="field">
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={form.message}
                    onChange={change}
                    placeholder=" "
                    required
                  />
                  <label htmlFor="message">Your message</label>
                </div>

                {status === "error" && (
                  <motion.p
                    className="formError"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Something went wrong. Please try again.
                  </motion.p>
                )}

                <motion.button
                  type="submit"
                  className="btn btnPrimary btnFull"
                  disabled={status === "submitting"}
                  whileHover={{ scale: status === "submitting" ? 1 : 1.02 }}
                  whileTap={{ scale: status === "submitting" ? 1 : 0.98 }}
                >
                  {status === "submitting" ? (
                    <>
                      <span className="spinner" /> Sending…
                    </>
                  ) : (
                    <>
                      <FaPaperPlane /> Send Message
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
