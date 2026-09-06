import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowUp } from "react-icons/fa6";
import MagneticButton from "./MagneticButton";
import { viewport, dur, ease } from "../motion";

const socials = [
  { icon: <FaGithub />, href: "https://github.com/yathamsridharreddy", label: "GitHub" },
  { icon: <FaLinkedin />, href: "https://www.linkedin.com/in/yatham-sridhar-reddy-744177374/", label: "LinkedIn" },
  { icon: <FaEnvelope />, href: "mailto:yathamsridharreddy99@gmail.com", label: "Email" },
];

export default function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={viewport}
      transition={{ duration: dur.base, ease: ease.out }}
    >
      <div className="footerInner">
        <div className="footerBrand">
          <span className="footerLogo">SRIDHAR</span>
          <p>Cloud &amp; DevOps Engineer in the making.</p>
        </div>

        <div className="footerSocials">
          {socials.map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={s.label}
              className="iconBtn"
              whileHover={{ y: -3, scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
            >
              {s.icon}
            </motion.a>
          ))}
        </div>
      </div>

      <div className="footerBottom">
        <span>© {new Date().getFullYear()} Yatham Sridhar Reddy</span>
        <MagneticButton href="#hero" className="backToTop" strength={12}>
          Back to top <FaArrowUp />
        </MagneticButton>
      </div>
    </motion.footer>
  );
}
