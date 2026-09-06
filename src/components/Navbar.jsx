import { useState, useEffect } from "react";
import { FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Journey", href: "#journey" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Certifications", href: "#certifications" },
  { name: "Coding Profiles", href: "#coding-profiles" },
  { name: "Achievements", href: "#achievements" },
  { name: "Contact", href: "#contact" }
];

const logoLetters = "SRIDHAR".split("");

const THEME_KEY = "portfolio-theme";

// Saved choice wins; otherwise follow the OS setting; otherwise dark.
function getInitialTheme() {
  if (typeof window === "undefined") return true;
  const saved = window.localStorage.getItem(THEME_KEY);
  if (saved === "dark") return true;
  if (saved === "light") return false;
  return !window.matchMedia("(prefers-color-scheme: light)").matches;
}

export default function Navbar() {
  const [dark, setDark] = useState(getInitialTheme);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    document.body.className = dark ? "dark" : "light";
    window.localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark]);

  // Follow the OS theme until the visitor picks one explicitly.
  useEffect(() => {
    if (window.localStorage.getItem(THEME_KEY)) return;
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = (e) => setDark(!e.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    const sections = navItems.map(item => item.href.substring(1));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.1, rootMargin: "-100px 0px -50% 0px" }
    );

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <motion.a
        href="#hero"
        className="navLogo"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        aria-label="Back to top"
      >
        {logoLetters.map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.08,
              type: "spring",
              stiffness: 200,
              damping: 10
            }}
            className="logoLetter"
          >
            {letter}
          </motion.span>
        ))}
      </motion.a>

      <div className="navLinks">
        {navItems.map((item, index) => {
          const sectionId = item.href.substring(1);
          return (
            <a 
              key={index}
              href={item.href}
              className={`navLink ${activeSection === sectionId ? "active" : ""}`}
            >
              {item.name}
            </a>
          );
        })}
      </div>

      <div className="navActions">
        <button 
          onClick={() => setDark(!dark)} 
          className="toggle"
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <FaSun /> : <FaMoon />}
        </button>

        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="menuToggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="mobileMenuOverlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              id="mobile-menu"
              className="mobileMenu"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              {navItems.map((item, index) => {
                const sectionId = item.href.substring(1);
                return (
                  <a
                    key={index}
                    href={item.href}
                    className={`mobileNavLink ${activeSection === sectionId ? "active" : ""}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
