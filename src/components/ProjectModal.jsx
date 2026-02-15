import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectModal({ project, close }) {
  const [showCarousel, setShowCarousel] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Reset state when project changes
  useEffect(() => {
    setShowCarousel(false);
    setCarouselIndex(0);
  }, [project]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (showCarousel) {
          setShowCarousel(false);
        } else {
          close();
        }
      }
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [close, showCarousel]);

  const openCarousel = () => {
    setCarouselIndex(0);
    setShowCarousel(true);
  };

  const nextImage = () => {
    if (project.images && project.images.length > 0) {
      setCarouselIndex((prev) => 
        prev === project.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (project.images && project.images.length > 0) {
      setCarouselIndex((prev) => 
        prev === 0 ? project.images.length - 1 : prev - 1
      );
    }
  };

  if (!project) return null;

  return (
    <>
      <motion.div 
        className="modalBg" 
        onClick={close}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div 
          className="modal" 
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
        >
          <motion.h3 
            id="modal-title"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {project.title}
          </motion.h3>
          
          <div className="modalImageContainer">
            <motion.img 
              src={project.arch} 
              alt={`Architecture diagram for ${project.title}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            />
            
            {/* Left arrow button on the right side */}
            {project.images && (
              <button 
                className="carouselArrow carouselArrowRight" 
                onClick={openCarousel}
                aria-label="View project images"
                title="View project images"
              >
                ◀
              </button>
            )}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {project.desc}
          </motion.p>
          <motion.a 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            GitHub
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Fullscreen Carousel Modal - Big Images Like Certificates */}
      <AnimatePresence>
        {showCarousel && (
          <motion.div 
            className="carouselModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCarousel(false)}
          >
            <motion.div 
              className="carouselModalContent"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="carouselClose" 
                onClick={() => setShowCarousel(false)}
              >
                ×
              </button>
              
              {/* Left Arrow */}
              <button 
                className="carouselNavArrow carouselNavLeft" 
                onClick={prevImage}
                aria-label="Previous image"
              >
                ←
              </button>
              
              {/* Main Image - Big like certificate */}
              <motion.img 
                key={carouselIndex}
                src={project.images[carouselIndex]} 
                alt={`Project image ${carouselIndex + 1}`}
                className="carouselModalImage"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Right Arrow */}
              <button 
                className="carouselNavArrow carouselNavRight" 
                onClick={nextImage}
                aria-label="Next image"
              >
                →
              </button>

              {/* Dots */}
              {project.images && project.images.length > 1 && (
                <div className="carouselDots" style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)' }}>
                  {project.images.map((_, index) => (
                    <span 
                      key={index} 
                      className={`carouselDot ${index === carouselIndex ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCarouselIndex(index);
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

