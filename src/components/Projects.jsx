import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";
import ProjectModal from "./ProjectModal";
import SectionHeading from "./SectionHeading";
import arch1 from "../assets/aws-arch1.png";
import arch2 from "../assets/aws-arch2.png";
import { stagger, cardIn, viewport, dur, ease } from "../motion";

const projects = [
  {
    id: "codesync",
    title: "CodeSync",
    tagline: "Coding activity automation with AWS SNS",
    desc: "A Flask service that tracks coding activity and pushes notification automation through AWS SNS, keeping teams in sync without manual check-ins.",
    tags: ["Flask", "AWS SNS", "Python", "REST"],
    arch: arch1,
    images: [
      "/project2-image1.jpeg",
      "/project2-image2.jpeg",
      "/project2-image3.jpeg",
      "/project2-image4.jpeg",
    ],
    link: "https://github.com/yathamsridharreddy/aws-cloud-projects/tree/main/CodeSync",
  },
  {
    id: "cloudsmiths",
    title: "CloudSmiths",
    tagline: "Scalable platform on EC2, RDS, S3 and Docker",
    desc: "A containerised cloud platform deployed across EC2 and RDS with S3-backed storage, designed for horizontal scale and repeatable deployments.",
    tags: ["AWS EC2", "RDS", "S3", "Docker"],
    arch: arch2,
    images: [
      "/project-image1.jpeg",
      "/project-image2.jpeg",
      "/project-image3.jpeg",
      "/project-image4.jpeg",
    ],
    link: "https://github.com/yathamsridharreddy/aws-cloud-projects/tree/main/CloudSmiths",
  },
];

export default function Projects() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="projects" className="section projectsSection">
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
                src={p.arch}
                alt={`${p.title} architecture diagram`}
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
