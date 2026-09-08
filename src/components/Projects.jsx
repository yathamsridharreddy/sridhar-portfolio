import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";
// The case study is only ever needed after a click, and it now carries the
// architecture diagram and the full engineering breakdown. Splitting it keeps
// that weight out of the initial bundle.
const ProjectModal = lazy(() => import("./ProjectModal"));
import SectionHeading from "./SectionHeading";
import Parallax from "./Parallax";
import { projects, projectById } from "../data/projects";
import { stagger, cardInFrom, viewport, dur, ease } from "../motion";

export default function Projects() {
  const [selected, setSelected] = useState(null);
  const reduced = useReducedMotion();

  // Skills link to the projects that prove them. They scroll here first, then
  // ask for the case study by id once the section is in view.
  useEffect(() => {
    const onOpen = (e) => {
      const project = projectById[e.detail];
      if (project) setSelected(project);
    };
    window.addEventListener("portfolio:open-project", onOpen);
    return () => window.removeEventListener("portfolio:open-project", onOpen);
  }, []);

  // The cover wipes in behind a mask instead of fading. It lives on the thumb
  // wrapper, never on the <img>, because the image carries a layoutId for the
  // morph into the modal and must stay free of competing transforms.
  const thumbWipe = reduced
    ? undefined
    : {
        hidden: { clipPath: "inset(0 100% 0 0)" },
        visible: {
          clipPath: "inset(0 0% 0 0)",
          transition: { duration: 0.85, ease: ease.out, delay: 0.12 },
        },
      };

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
        {projects.map((p, i) => (
          <motion.article
            key={p.id}
            className="projectCard"
            variants={cardInFrom(i % 2 === 0 ? "left" : "right", 46)}
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
            <motion.div className="projectThumb" variants={thumbWipe}>
              <motion.img
                layoutId={`thumb-${p.id}`}
                src={p.thumb}
                alt={`${p.title} cover art`}
                loading="lazy"
              />
              <span className="projectShine" aria-hidden="true" />
            </motion.div>

            <div className="projectBody">
              <motion.h3 layoutId={`title-${p.id}`} className="projectTitle">
                {p.title}
              </motion.h3>
              <p className="projectTagline">{p.tagline}</p>

              {p.focus && <p className="projectFocus">{p.focus}</p>}

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
          <Suspense fallback={null}>
            <ProjectModal project={selected} close={() => setSelected(null)} />
          </Suspense>
        )}
      </AnimatePresence>
    </section>
  );
}
