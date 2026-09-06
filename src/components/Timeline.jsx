import { useRef } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { viewport, dur, ease } from "../motion";

const items = [
  {
    year: "Foundation",
    title: "Built a Solid Foundation in Linux and Cloud Technologies",
    body: "Hands-on with Linux administration, networking fundamentals and core AWS services.",
  },
  {
    year: "Project",
    title: "Built Sridhar Rush",
    body: "A real-time multiplayer racing game turning phones into wireless controllers over a 30Hz WebSocket relay.",
  },
  {
    year: "Project",
    title: "Built CloudCompare AI",
    body: "A multi-cloud comparison platform on Spring Boot and React, provisioned across AWS with Terraform.",
  },
  {
    year: "Certified",
    title: "Earned AWS Certified Developer – Associate",
    body: "Validated serverless, IaC and CI/CD skills against AWS production standards, alongside the MongoDB Associate Developer certification.",
  },
  {
    year: "Now",
    title: "Going Deeper on Kubernetes and Observability",
    body: "Moving from single services to orchestrated, monitored deployments across multi-account AWS environments.",
  },
];

export default function Timeline() {
  const reduced = useReducedMotion();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section id="journey" className="section journeySection">
      <SectionHeading eyebrow="How I got here" title="Journey" />

      <div className="timeline" ref={ref}>
        <div className="timelineRail" aria-hidden="true">
          <motion.div
            className="timelineProgress"
            style={reduced ? { scaleY: 1 } : { scaleY }}
          />
        </div>

        {items.map((item, i) => (
          <motion.div
            key={item.title}
            className="timelineItem"
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewport}
            transition={{ duration: dur.base, ease: ease.out, delay: i * 0.06 }}
          >
            <motion.span
              className="timelineNode"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={viewport}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 18,
                delay: i * 0.06 + 0.1,
              }}
            />
            <div className="timelineCard">
              <span className="timelineYear">{item.year}</span>
              <h3 className="timelineTitle">{item.title}</h3>
              <p className="timelineBody">{item.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
