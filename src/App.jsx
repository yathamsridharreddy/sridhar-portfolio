import Preloader from "./components/Preloader";
import Cursor from "./components/Cursor";
import ScrollProgress from "./components/ScrollProgress";
import Navbar from "./components/Navbar";
import ViewerCount from "./components/ViewerCount";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Timeline from "./components/Timeline";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Certifications from "./components/Certifications";
import CodingProfiles from "./components/CodingProfiles";
import Achievements from "./components/Achievements";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <a className="skipLink" href="#main">
        Skip to content
      </a>
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <ViewerCount />

      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Timeline />
        <Projects />
        <Experience />
        <Education />
        <Certifications />
        <CodingProfiles />
        <Achievements />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
