import { lazy, Suspense } from "react";
import Preloader from "./components/Preloader";
import Cursor from "./components/Cursor";
import ScrollProgress from "./components/ScrollProgress";
import Navbar from "./components/Navbar";
import CommandPalette from "./components/CommandPalette";
import ChaosMode from "./components/ChaosMode";
import GitHubActivity from "./components/GitHubActivity";
import ViewerCount from "./components/ViewerCount";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Pipeline from "./components/Pipeline";
import Timeline from "./components/Timeline";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Certifications from "./components/Certifications";
import CodingProfiles from "./components/CodingProfiles";
import Achievements from "./components/Achievements";
import Terminal from "./components/Terminal";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
// The assistant is only ever needed after a click, so it is split into its
// own chunk that never blocks first paint.
const Assistant = lazy(() => import("./components/Assistant"));

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
      <CommandPalette />
      <ChaosMode />
      <ViewerCount />
      <Suspense fallback={null}>
        <Assistant />
      </Suspense>

      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Pipeline />
        <Timeline />
        <Projects />
        <GitHubActivity />
        <Experience />
        <Education />
        <Certifications />
        <CodingProfiles />
        <Achievements />
        <Terminal />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
