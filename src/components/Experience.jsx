import { motion } from "framer-motion";
import { FaBriefcase, FaCertificate, FaArrowUpRightFromSquare } from "react-icons/fa6";
import SectionHeading from "./SectionHeading";
import Parallax from "./Parallax";
import TiltCard from "./TiltCard";
import { viewport, dur, ease, stagger, slideIn } from "../motion";

const items = [
  {
    role: "AWS Cloud Intern",
    company: "Technical Hub Pvt Ltd",
    kind: "Summer Internship",
    period: "May 2025 – June 2025",
    description: [
      "Architected and deployed secure AWS infrastructure by configuring EC2 instances within custom VPC networks, ensuring optimized connectivity and performance.",
      "Implemented IAM roles and access policies to enforce secure authentication and controlled server-level permissions.",
      "Built and tested cloud-based client–server models, gaining practical exposure to scalable architecture and real-world deployment strategies.",
    ],
    cert: "/technical-hub-cert.pdf",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="section experienceSection">
      <Parallax className="sectionGlow at-right" speed={-40} aria-hidden="true" />
      <SectionHeading eyebrow="Where I have worked" title="Experience" />

      <motion.div
        className="experienceContainer"
        variants={stagger(0.1, 0.05)}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {items.map((item) => (
          <motion.div key={item.role} variants={slideIn("left", 36)}>
            <TiltCard className="experienceCard" max={5}>
              <div className="experienceHeader">
                <span className="experienceIcon">
                  <FaBriefcase />
                </span>
                <div className="experienceRole">
                  <h3>{item.role}</h3>
                  <p className="experienceCompany">
                    {item.company} <span className="dotSep">•</span> {item.kind}
                  </p>
                </div>
                <span className="chip">{item.period}</span>
              </div>

              <ul className="bulletList">
                {item.description.map((d, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewport}
                    transition={{
                      duration: dur.base,
                      ease: ease.out,
                      delay: 0.15 + i * 0.08,
                    }}
                  >
                    {d}
                  </motion.li>
                ))}
              </ul>

              {item.cert && (
                <a
                  href={item.cert}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btnGhost btnSm"
                >
                  <FaCertificate /> View Certificate{" "}
                  <FaArrowUpRightFromSquare className="btnTrail" />
                </a>
              )}
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
