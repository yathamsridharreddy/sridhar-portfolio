import { motion } from "framer-motion";
import { SiCodechef, SiLeetcode, SiHackerrank } from "react-icons/si";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import SectionHeading from "./SectionHeading";
import { viewport, stagger, cardIn, dur, ease } from "../motion";

const profiles = [
  {
    name: "CodeChef",
    handle: "yathamsridharr",
    href: "https://www.codechef.com/users/yathamsridharr",
    icon: <SiCodechef />,
    accent: "#d0a678",
  },
  {
    name: "LeetCode",
    handle: "yathamsridharreddy",
    href: "https://leetcode.com/u/yathamsridharreddy/",
    icon: <SiLeetcode />,
    accent: "#FFA116",
  },
  {
    name: "HackerRank",
    handle: "yathamsridhar",
    href: "https://www.hackerrank.com/profile/yathamsridhar",
    icon: <SiHackerrank />,
    accent: "#00EA64",
  },
];

export default function CodingProfiles() {
  return (
    <section id="coding-profiles" className="section profilesSection">
      <SectionHeading eyebrow="Where I practise" title="Coding Profiles" />

      <motion.div
        className="profilesGrid"
        variants={stagger(0.1, 0.05)}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {profiles.map((p) => (
          <motion.a
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="profileCard"
            variants={cardIn}
            style={{ "--accent": p.accent }}
            whileHover={{ y: -8 }}
            transition={{ duration: dur.fast, ease: ease.out }}
          >
            <span className="profileGlow" aria-hidden="true" />
            <span className="profileIcon">{p.icon}</span>
            <span className="profileName">{p.name}</span>
            <span className="profileHandle">@{p.handle}</span>
            <FaArrowUpRightFromSquare className="profileArrow" />
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
