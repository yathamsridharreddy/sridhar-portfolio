import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaXmark, FaChevronLeft, FaChevronRight, FaGithub, FaImages,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";
import { ease, dur, spring } from "../motion";

export default function ProjectModal({ project, close }) {
  const [carousel, setCarousel] = useState(false);
  const [index, setIndex] = useState(0);
  const dialogRef = useRef(null);
  const lastFocused = useRef(null);

  useEffect(() => {
    setCarousel(false);
    setIndex(0);
  }, [project]);

  // Focus management: trap inside the dialog, restore on close.
  useEffect(() => {
    lastFocused.current = document.activeElement;
    dialogRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      lastFocused.current?.focus?.();
    };
  }, []);

  const count = project.images?.length ?? 0;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        carousel ? setCarousel(false) : close();
      }
      if (carousel && e.key === "ArrowRight") next();
      if (carousel && e.key === "ArrowLeft") prev();
      if (e.key === "Tab" && !carousel) {
        const nodes = dialogRef.current?.querySelectorAll(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        if (!nodes?.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [carousel, close, count]);

  const next = useCallback(
    () => setIndex((i) => (i === count - 1 ? 0 : i + 1)),
    [count]
  );
  const prev = useCallback(
    () => setIndex((i) => (i === 0 ? count - 1 : i - 1)),
    [count]
  );

  return (
    <>
      <motion.div
        className="modalBg"
        onClick={close}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: dur.fast }}
      >
        <motion.div
          ref={dialogRef}
          tabIndex={-1}
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          layoutId={`card-${project.id}`}
          onClick={(e) => e.stopPropagation()}
          transition={spring.base}
        >
          <button className="modalClose" onClick={close} aria-label="Close">
            <FaXmark />
          </button>

          <div className="modalMedia">
            <motion.img
              layoutId={`thumb-${project.id}`}
              src={project.thumb}
              alt={`${project.title} cover art`}
            />
            {count > 0 && (
              <button
                className="modalGalleryBtn"
                onClick={() => {
                  setIndex(0);
                  setCarousel(true);
                }}
              >
                <FaImages /> {count} {count === 1 ? "image" : "images"}
              </button>
            )}
          </div>

          <div className="modalBody">
            <motion.h3 layoutId={`title-${project.id}`} id="modal-title">
              {project.title}
            </motion.h3>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: dur.base, ease: ease.out }}
            >
              <p className="modalDesc">{project.desc}</p>

              <ul className="tagRow">
                {project.tags?.map((t) => (
                  <li key={t} className="tag">{t}</li>
                ))}
              </ul>

              <div className="modalActions">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btnPrimary modalLink"
                  >
                    <FaArrowUpRightFromSquare /> Live demo
                  </a>
                )}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btnGhost modalLink"
                >
                  <FaGithub /> View code
                </a>
              </div>

              {project.architecture && (
                <section className="archBlock" aria-label="Architecture">
                  <h4 className="modalSubhead">Architecture</h4>
                  <ol className="archFlow">
                    {project.architecture.flow.map((n, i) => (
                      <li className="archNode" key={n.label}>
                        <span className="archIndex" aria-hidden="true">
                          {i + 1}
                        </span>
                        <span className="archNodeMain">
                          <span className="archLabel">{n.label}</span>
                          <span className="archSub">{n.sub}</span>
                          {n.tech && <span className="archTech">{n.tech}</span>}
                        </span>
                      </li>
                    ))}
                  </ol>

                  {project.architecture.infra?.length > 0 && (
                    <div className="archInfra">
                      <span className="archInfraLabel">
                        {project.architecture.infraLabel}
                      </span>
                      <ul className="archInfraRow">
                        {project.architecture.infra.map((t) => (
                          <li key={t} className="tag">
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.architecture.caption && (
                    <p className="archCaption">{project.architecture.caption}</p>
                  )}
                </section>
              )}

              {project.breakdown?.length > 0 && (
                <section className="breakdown" aria-label="Engineering breakdown">
                  <h4 className="modalSubhead">Engineering breakdown</h4>
                  <dl className="breakdownList">
                    {project.breakdown.map((row) => (
                      <div className="breakdownRow" key={row.k}>
                        <dt>{row.k}</dt>
                        <dd>
                          {Array.isArray(row.v) ? (
                            <ul className="breakdownBullets">
                              {row.v.map((line, i) => (
                                <li key={i}>{line}</li>
                              ))}
                            </ul>
                          ) : (
                            row.v
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {carousel && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCarousel(false)}
          >
            <button
              className="lightboxClose"
              onClick={() => setCarousel(false)}
              aria-label="Close gallery"
            >
              <FaXmark />
            </button>

            <button
              className="lightboxNav prev"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
            >
              <FaChevronLeft />
            </button>

            <AnimatePresence mode="wait">
              <motion.img
                key={index}
                src={project.images[index]}
                alt={`${project.title} image ${index + 1}`}
                className="lightboxImage"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: dur.fast, ease: ease.out }}
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>

            <button
              className="lightboxNav next"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next image"
            >
              <FaChevronRight />
            </button>

            <div className="lightboxDots" onClick={(e) => e.stopPropagation()}>
              {project.images.map((_, i) => (
                <button
                  key={i}
                  className={`lightboxDot ${i === index ? "active" : ""}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
