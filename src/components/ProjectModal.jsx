import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaXmark, FaChevronLeft, FaChevronRight, FaGithub, FaImages,
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
  });

  const count = project.images?.length ?? 0;
  const next = () => setIndex((i) => (i === count - 1 ? 0 : i + 1));
  const prev = () => setIndex((i) => (i === 0 ? count - 1 : i - 1));

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
              src={project.arch}
              alt={`Architecture diagram for ${project.title}`}
            />
            {count > 0 && (
              <button
                className="modalGalleryBtn"
                onClick={() => {
                  setIndex(0);
                  setCarousel(true);
                }}
              >
                <FaImages /> {count} screenshots
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

              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btnPrimary modalLink"
              >
                <FaGithub /> View on GitHub
              </a>
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
                alt={`${project.title} screenshot ${index + 1}`}
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
