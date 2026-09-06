import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaAws, FaCertificate, FaXmark, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { SiMongodb } from "react-icons/si";
import SectionHeading from "./SectionHeading";
import Parallax from "./Parallax";
import TiltCard from "./TiltCard";
import { viewport, stagger, cardIn, dur, ease, spring } from "../motion";

// `verify` points at the public Credly badge (authoritative proof).
// `cert` is an optional local PDF; the button is hidden until the file exists.
// `badge` is an optional local badge image shown in the lightbox.
const certifications = [
  {
    id: "aws-dva",
    icon: <FaAws />,
    title: "AWS Certified Developer – Associate",
    org: "Amazon Web Services Training and Certification",
    desc: "Validates developing, deploying and debugging cloud-native applications on AWS.",
    skills: ["AWS", "AWS Cloud", "Code Development", "Code Deployment", "Cloud Certification"],
    cert: "/aws-developer-associate-cert.pdf",
    badge: "/aws-developer-associate-badge.png",
    verify:
      "https://www.credly.com/earner/earned/badge/b6c2f79f-6f9f-466e-9305-befe9506f910",
    accent: "#FF9900",
  },
  {
    id: "mongodb-dev",
    icon: <SiMongodb />,
    title: "MongoDB Associate Developer",
    org: "MongoDB",
    desc: "Validates building applications against MongoDB using drivers, indexes and the document model.",
    skills: ["MongoDB", "Node.js", "Data Modeling", "CRUD", "MongoDB Indexes", "JavaScript"],
    cert: "/mongodb-associate-cert.pdf",
    badge: "/mongodb-associate-badge.png",
    verify:
      "https://www.credly.com/earner/earned/badge/223f1b98-5876-4ec0-9bd1-fe7f8ea66b7a",
    accent: "#47A248",
  },
  {
    id: "htmlcss",
    icon: <FaCertificate />,
    title: "IT Specialist — HTML and CSS",
    org: "Certiport",
    desc: "Certified in web development fundamentals.",
    skills: ["HTML", "CSS", "Web Fundamentals"],
    cert: "/html-css-cert.pdf",
    badge: "/html-css-badge.png",
    verify:
      "https://www.credly.com/earner/earned/badge/ef7fa949-dfde-4ecd-aa27-4b02b1466e4f",
    accent: "#E34F26",
  },
];

export default function Certifications() {
  const [badge, setBadge] = useState(null);

  return (
    <section id="certifications" className="section certificationsSection">
      <Parallax className="sectionGlow at-right" speed={-50} aria-hidden="true" />
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

              {c.skills?.length > 0 && (
                <ul className="tagRow">
                  {c.skills.map((s) => (
                    <li key={s} className="tag">
                      {s}
                    </li>
                  ))}
                </ul>
              )}

              <div className="certActions">
                {c.verify && (
                  <a
                    href={c.verify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btnAccent btnSm"
                  >
                    Verify on Credly{" "}
                    <FaArrowUpRightFromSquare className="btnTrail" />
                  </a>
                )}
                {c.cert && (
                  <a
                    href={c.cert}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btnGhost btnSm"
                  >
                    Certificate <FaArrowUpRightFromSquare className="btnTrail" />
                  </a>
                )}
                {c.badge && (
                  <button
                    className="btn btnGhost btnSm"
                    onClick={() => setBadge(c)}
                  >
                    View Badge
                  </button>
                )}
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
