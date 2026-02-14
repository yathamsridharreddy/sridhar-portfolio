import { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { motion } from "framer-motion";

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Certifications", href: "#certifications" },
  { name: "Coding Profiles", href: "#coding-profiles" },
  { name: "Achievements", href: "#achievements" },
  { name: "Contact", href: "#contact" }
];

const logoLetters = "SRIDHAR".split("");

export default function Navbar() {
  const [dark, setDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    document.body.className = dark ? "dark" : "light";
  }, [dark]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      <motion.div 
        className="navLogo"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
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
      </motion.div>
      
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

      <button 
        onClick={() => setDark(!dark)} 
        className="toggle"
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {dark ? <FaSun /> : <FaMoon />}
      </button>
    </nav>
  );
}

