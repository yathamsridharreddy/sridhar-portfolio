import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import {
  FaCodeBranch,
  FaDocker,
  FaVialCircleCheck,
  FaRocket,
  FaChartLine,
} from "react-icons/fa6";
import SectionHeading from "./SectionHeading";
import Parallax from "./Parallax";
import { viewport, dur, ease } from "../motion";

/**
 * A CI/CD pipeline that runs as you scroll.
 *
 * This is the one piece of motion on the site that carries information rather
 * than decorating it: the sequence is the work. Scroll progress drives a single
 * CSS custom property, --p, and everything else reads from it. That keeps the
 * layout responsive without a JS breakpoint, because the stylesheet decides
 * whether --p fills the wire horizontally or vertically.
 */

const stages = [
  { id: "commit", icon: <FaCodeBranch />, label: "Commit", cmd: "git push origin main" },
  { id: "build", icon: <FaDocker />, label: "Build", cmd: "docker build -t app ." },
  { id: "test", icon: <FaVialCircleCheck />, label: "Test", cmd: "pytest --cov" },
  { id: "deploy", icon: <FaRocket />, label: "Deploy", cmd: "kubectl apply -f k8s/" },
  { id: "monitor", icon: <FaChartLine />, label: "Monitor", cmd: "prometheus targets" },
];

export default function Pipeline() {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const [reached, setReached] = useState(reduced ? stages.length : 0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.65"],
  });

  // Spring so the payload glides between stages instead of tracking the
  // scroll wheel one-to-one, which reads as jitter on a trackpad.
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useMotionValueEvent(progress, "change", (v) => {
    if (reduced) return;
    // A stage is considered green once the payload has passed its node.
    const next = stages.filter((_, i) => v >= (i + 0.6) / stages.length).length;
    setReached((prev) => (prev === next ? prev : next));
  });

  return (
    <section id="pipeline" className="section pipelineSection">
      <Parallax className="sectionGlow at-right" speed={-45} aria-hidden="true" />
      <SectionHeading eyebrow="How I ship" title="Delivery Pipeline" />

      <motion.div
        className="pipeline"
        ref={ref}
        style={reduced ? { "--p": 1 } : { "--p": progress }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: dur.base, ease: ease.out }}
      >
        <div className="pipelineWire" aria-hidden="true">
          <span className="pipelineFill" />
          {!reduced && <span className="pipelinePayload" />}
        </div>

        <ol className="pipelineStages">
          {stages.map((s, i) => (
            <li
              key={s.id}
              className={`pipelineStage${i < reached ? " is-done" : ""}`}
            >
              <span className="pipelineNode" aria-hidden="true">
                {s.icon}
              </span>
              <span className="pipelineLabel">{s.label}</span>
              <code className="pipelineCmd">{s.cmd}</code>
              <span className="pipelineStatus">
                {i < reached ? "passed" : "queued"}
              </span>
            </li>
          ))}
        </ol>
      </motion.div>
    </section>
  );
}
