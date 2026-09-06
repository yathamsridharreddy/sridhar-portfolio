import { useState, useEffect } from "react";
import { FaMoon, FaSun, FaBars, FaXmark } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { ease, dur, spring } from "../motion";

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Journey", href: "#journey" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Certifications", href: "#certifications" },
  { name: "Profiles", href: "#coding-profiles" },
  { name: "Achievements", href: "#achievements" },
  { name: "Contact", href: "#contact" },
];

const logoLetters = "SRIDHAR".split("");
const THEME_KEY = "portfolio-theme";

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
    document.body.classList.toggle("dark", dark);
    document.body.classList.toggle("light", !dark);
    window.localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    if (window.localStorage.getItem(THEME_KEY)) return;
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = (e) => setDark(!e.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const ids = navItems.map((i) => i.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.1, rootMargin: "-100px 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      className={`nav ${scrolled ? "scrolled" : ""}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: dur.slow, ease: ease.out, delay: 0.1 }}
    >
      <a href="#hero" className="navLogo" aria-label="Back to top">
        {logoLetters.map((letter, i) => (
          <motion.span
            key={i}
            className="logoLetter"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring.bouncy, delay: 0.3 + i * 0.05 }}
          >
            {letter}
          </motion.span>
        ))}
        <span className="logoDot" />
      </a>

      <div className="navLinks">
        {navItems.map((item) => {
          const id = item.href.slice(1);
          const active = activeSection === id;
          return (
            <a
              key={id}
              href={item.href}
              className={`navLink ${active ? "active" : ""}`}
            >
              {active && (
                <motion.span
                  className="navPill"
                  layoutId="navPill"
                  transition={spring.base}
                />
              )}
              <span className="navLinkText">{item.name}</span>
            </a>
          );
        })}
      </div>

      <div className="navActions">
        <button
          onClick={() => setDark(!dark)}
          className="iconBtn"
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={dark ? "sun" : "moon"}
              initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
              transition={{ duration: dur.fast, ease: ease.out }}
              style={{ display: "grid", placeItems: "center" }}
            >
              {dark ? <FaSun /> : <FaMoon />}
            </motion.span>
          </AnimatePresence>
        </button>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="iconBtn menuToggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <FaXmark /> : <FaBars />}
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
              transition={{ duration: dur.fast }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              id="mobile-menu"
              className="mobileMenu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: dur.base, ease: ease.out }}
            >
              {navItems.map((item, i) => {
                const id = item.href.slice(1);
                return (
                  <motion.a
                    key={id}
                    href={item.href}
                    className={`mobileNavLink ${
                      activeSection === id ? "active" : ""
                    }`}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.08 + i * 0.04,
                      duration: dur.base,
                      ease: ease.out,
                    }}
                  >
                    <span className="mobileNavIndex">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.name}
                  </motion.a>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
