import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa6";
import SectionHeading from "./SectionHeading";
import TiltCard from "./TiltCard";
import Counter from "./Counter";
import { viewport, stagger, cardIn } from "../motion";

const items = [
  {
    institution: "Aditya College Of Engineering And Technology",
    period: "2023 – 2027",
    degree: "Bachelor of Technology in Computer Science",
    metric: { label: "CGPA", value: 8.3, decimals: 2 },
  },
  {
    institution: "Bhashyam Junior College, Guntur",
    period: "2021 – 2023",
    degree: "Board of Intermediate Education Andhra Pradesh, MPC",
    metric: { label: "Score", value: 9.47, decimals: 2 },
  },
];

export default function Education() {
  return (
    <section id="education" className="section educationSection">
      <SectionHeading eyebrow="Where I studied" title="Education" />

      <motion.div
        className="educationContainer"
        variants={stagger(0.1, 0.05)}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {items.map((item) => (
          <motion.div key={item.institution} variants={cardIn}>
            <TiltCard className="educationCard" max={6}>
              <span className="educationIcon">
                <FaGraduationCap />
              </span>

              <div className="educationContent">
                <h3>{item.institution}</h3>
                <span className="chip">{item.period}</span>
                <p className="educationDegree">{item.degree}</p>
              </div>

              <div className="educationMetric">
                <Counter
                  className="metricValue"
                  value={item.metric.value}
                  decimals={item.metric.decimals}
                />
                <span className="metricLabel">{item.metric.label}</span>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
