import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";
import ProjectModal from "./ProjectModal";
import SectionHeading from "./SectionHeading";
import Parallax from "./Parallax";
import carCover from "../assets/car-game-cover.webp";
import carPoster from "../assets/car-game-poster.webp";
import carArch from "../assets/car-game-architecture.webp";
import cloudCover from "../assets/cloud-compare-cover.webp";
import { stagger, cardIn, viewport, dur, ease } from "../motion";

const projects = [
  {
    id: "sridhar-rush",
    title: "Sridhar Rush",
    tagline: "Real-time multiplayer racing where your phone is the controller",
    desc: "A real-time 3D racing game that splits the console in two: the laptop renders the race while phones become wireless gamepads over a QR scan, with no install or sign-up. A 30Hz authoritative relay keeps players in sync across the internet, backed by Supabase for leaderboards and ghost laps. Ships five race modes and five circuits, plus an installable PWA build and an offline AI opponent for solo play.",
    tags: ["JavaScript", "WebSockets", "Node.js", "Supabase", "PWA", "Vercel"],
    thumb: carCover,
    images: [carPoster, carArch],
    demo: "https://sridhar-drift.vercel.app/",
    link: "https://github.com/yathamsridharreddy/MULTIPLAYER-CAR-GAME",
  },
  {
    id: "cloudcompare-ai",
    title: "CloudCompare AI",
    tagline: "Multi-cloud comparison and recommendation platform",
    desc: "A full-stack platform that evaluates infrastructure across AWS, Azure, Google Cloud, Oracle Cloud and Alibaba Cloud, weighing compute, storage, pricing estimates, performance and regional availability to produce ranked recommendations by cost or performance priority. The production stack runs a React build on S3 behind API Gateway, with a Dockerised Spring Boot API on EC2 and a private RDS MySQL instance, all provisioned reproducibly through Terraform.",
    tags: ["Java 21", "Spring Boot", "React 19", "AWS", "Terraform", "Docker", "Jenkins"],
    thumb: cloudCover,
    images: [],
    demo: "https://cloud-compareai.vercel.app/",
    link: "https://github.com/yathamsridharreddy/CLOUD-COMPARE-AI",
  },
];

export default function Projects() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="projects" className="section projectsSection">
      <Parallax className="sectionGlow at-left" speed={-55} aria-hidden="true" />
      <SectionHeading eyebrow="Things I have built" title="Projects" />

      <motion.div
        className="projectsGrid"
        variants={stagger(0.12, 0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {projects.map((p) => (
          <motion.article
            key={p.id}
            className="projectCard"
            variants={cardIn}
            layoutId={`card-${p.id}`}
            onClick={() => setSelected(p)}
            whileHover={{ y: -8 }}
            transition={{ duration: dur.fast, ease: ease.out }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelected(p);
              }
            }}
            aria-label={`View details for ${p.title}`}
          >
            <div className="projectThumb">
              <motion.img
                layoutId={`thumb-${p.id}`}
                src={p.thumb}
                alt={`${p.title} cover art`}
                loading="lazy"
              />
              <span className="projectShine" aria-hidden="true" />
            </div>

            <div className="projectBody">
              <motion.h3 layoutId={`title-${p.id}`} className="projectTitle">
                {p.title}
              </motion.h3>
              <p className="projectTagline">{p.tagline}</p>

              <ul className="tagRow">
                {p.tags.map((t) => (
                  <li key={t} className="tag">
                    {t}
                  </li>
                ))}
              </ul>

              <span className="projectCta">
                View case study <FaArrowRight />
              </span>
            </div>
          </motion.article>
        ))}
      </motion.div>

      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} close={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
