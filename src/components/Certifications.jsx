import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaAws, FaCertificate, FaXmark, FaArrowUpRightFromSquare } from "react-icons/fa6";
import SectionHeading from "./SectionHeading";
import TiltCard from "./TiltCard";
import { viewport, stagger, cardIn, dur, ease, spring } from "../motion";

const certifications = [
  {
    id: "aws",
    icon: <FaAws />,
    title: "AWS Academy Graduate — Cloud Developing",
    org: "Amazon Web Services",
    desc: "Certified in building cloud applications on AWS infrastructure.",
    cert: "/aws-cloud-developing-cert.pdf",
    badge: "/aws-academy-badge.png",
    accent: "#FF9900",
  },
  {
    id: "htmlcss",
    icon: <FaCertificate />,
    title: "IT Specialist — HTML and CSS",
    org: "Certiport",
    desc: "Certified in web development fundamentals.",
    cert: "/html-css-cert.pdf",
    badge: "/html-css-badge.png",
    accent: "#E34F26",
  },
];

export default function Certifications() {
  const [badge, setBadge] = useState(null);

  return (
    <section id="certifications" className="section certificationsSection">
      <SectionHeading eyebrow="Verified skills" title="Certifications" />

      <motion.div
        className="certGrid"
        variants={stagger(0.1, 0.05)}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {certifications.map((c) => (
          <motion.div key={c.id} variants={cardIn}>
            <TiltCard className="certCard" max={7} style={{ "--accent": c.accent }}>
              <span className="certIcon">{c.icon}</span>
              <h3 className="certTitle">{c.title}</h3>
              <span className="certOrg">{c.org}</span>
              <p className="certDesc">{c.desc}</p>

              <div className="certActions">
                <a
                  href={c.cert}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btnGhost btnSm"
                >
                  Certificate <FaArrowUpRightFromSquare className="btnTrail" />
                </a>
                <button
                  className="btn btnAccent btnSm"
                  onClick={() => setBadge(c)}
                >
                  View Badge
                </button>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {badge && (
          <motion.div
            className="modalBg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur.fast }}
            onClick={() => setBadge(null)}
          >
            <motion.div
              className="badgeModal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={spring.base}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={`${badge.title} badge`}
            >
              <button
                className="modalClose"
                onClick={() => setBadge(null)}
                aria-label="Close"
              >
                <FaXmark />
              </button>
              <motion.img
                src={badge.badge}
                alt={`${badge.title} badge`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: dur.base, ease: ease.out }}
              />
              <p className="badgeCaption">{badge.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
