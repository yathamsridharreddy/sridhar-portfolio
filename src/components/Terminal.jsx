import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaTerminal } from "react-icons/fa6";
import SectionHeading from "./SectionHeading";
import Parallax from "./Parallax";
import { viewport, dur, ease } from "../motion";

/**
 * A small, real terminal.
 *
 * Deliberately not a gimmick: it uses a genuine <input>, so mobile keyboards,
 * paste, autofill and screen readers all behave. Output is announced through an
 * aria-live log. Because nobody discovers a prompt they cannot see, the common
 * commands are also clickable chips, which doubles as the mobile interface.
 */

const RESUME = "/sridhar_final-resume.pdf";

const skillsYml = [
  "cloud:",
  "  - AWS (EC2, S3, RDS, Lambda)",
  "containers:",
  "  - Docker",
  "  - Kubernetes",
  "iac:",
  "  - Terraform",
  "  - Ansible",
  "ci_cd:",
  "  - GitHub Actions",
  "  - Jenkins",
  "languages:",
  "  - Python, Java, C/C++, SQL",
];

const projects = [
  "sridhar-rush/        real-time multiplayer racing, 30Hz WebSocket relay",
  "cloud-compare-ai/    multi-cloud comparison, Spring Boot + React + Terraform",
];

const certs = [
  "AWS Certified Developer - Associate      Amazon Web Services",
  "MongoDB Associate Developer              MongoDB",
  "HTML & CSS Certification                 Certiport",
];

const HELP = [
  "Available commands:",
  "",
  "  whoami        who you are talking to",
  "  skills        cat skills.yml",
  "  projects      ls projects/",
  "  certs         earned certifications",
  "  contact       how to reach me",
  "  resume        open my resume",
  "  clear         clear the screen",
];

const BANNER = [
  "Welcome. This is a real prompt, so type away.",
  "Try 'help' for the list of commands.",
];

function run(cmd) {
  const c = cmd.trim().toLowerCase();
  if (!c) return [];

  switch (c) {
    case "help":
    case "?":
      return HELP;
    case "whoami":
      return [
        "Yatham Sridhar Reddy",
        "Cloud and DevOps Engineer, AWS Certified Developer - Associate",
        "Computer Science student focused on automated, production-ready systems.",
      ];
    case "skills":
    case "cat skills.yml":
      return skillsYml;
    case "projects":
    case "ls":
    case "ls projects":
      return projects;
    case "certs":
    case "certifications":
      return certs;
    case "contact":
      return [
        "email     yathamsridharreddy99@gmail.com",
        "github    github.com/yathamsridharreddy",
        "credly    credly.com/users/yatham-sridhar-reddy",
      ];
    case "resume":
      window.open(RESUME, "_blank", "noopener,noreferrer");
      return ["Opening resume in a new tab..."];
    case "sudo":
    case "sudo su":
      return ["Nice try. You do not have the pod security policy for that."];
    case "exit":
      return ["There is no escape. Just scroll."];
    default:
      return [`command not found: ${cmd.trim()}`, "Type 'help' for options."];
  }
}

const CHIPS = ["whoami", "skills", "projects", "certs", "contact", "resume"];

export default function Terminal() {
  const reduced = useReducedMotion();
  const [lines, setLines] = useState(() =>
    BANNER.map((text) => ({ kind: "out", text }))
  );
  const [value, setValue] = useState("");
  const [history, setHistory] = useState([]);
  const [hIndex, setHIndex] = useState(-1);

  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  const submit = useCallback(
    (raw) => {
      const cmd = raw.trim();
      if (!cmd) return;

      if (cmd.toLowerCase() === "clear") {
        setLines([]);
        setValue("");
        setHistory((h) => [cmd, ...h]);
        setHIndex(-1);
        return;
      }

      const output = run(cmd);
      setLines((prev) => [
        ...prev,
        { kind: "cmd", text: cmd },
        ...output.map((text) => ({ kind: "out", text })),
      ]);
      setHistory((h) => [cmd, ...h]);
      setHIndex(-1);
      setValue("");
    },
    []
  );

  // Keep the newest line visible without yanking the whole page around.
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(value);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = Math.min(hIndex + 1, history.length - 1);
      setHIndex(next);
      setValue(history[next]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = hIndex - 1;
      setHIndex(next);
      setValue(next < 0 ? "" : history[next]);
    }
  };

  return (
    <section id="terminal" className="section terminalSection">
      <Parallax className="sectionGlow at-left" speed={-40} aria-hidden="true" />
      <SectionHeading eyebrow="Have a look around" title="Terminal" />

      <motion.div
        className="terminal"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: dur.base, ease: ease.out }}
      >
        <div className="terminalBar">
          <span className="terminalDot is-red" aria-hidden="true" />
          <span className="terminalDot is-amber" aria-hidden="true" />
          <span className="terminalDot is-green" aria-hidden="true" />
          <span className="terminalTitle">
            <FaTerminal aria-hidden="true" /> sridhar@portfolio: ~
          </span>
        </div>

        <div
          className="terminalBody"
          ref={bodyRef}
          onClick={() => inputRef.current?.focus()}
        >
          <div className="terminalLog" role="log" aria-live="polite">
            {lines.map((l, i) =>
              l.kind === "cmd" ? (
                <div className="termLine is-cmd" key={i}>
                  <span className="termPrompt">$</span>
                  <span>{l.text}</span>
                </div>
              ) : (
                <motion.div
                  className="termLine"
                  key={i}
                  initial={reduced ? false : { opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18, ease: ease.out }}
                >
                  {l.text || "\u00a0"}
                </motion.div>
              )
            )}
          </div>

          <div className="terminalInputRow">
            <label className="termPrompt" htmlFor="termInput">
              $
            </label>
            <input
              id="termInput"
              ref={inputRef}
              className="terminalInput"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="type a command, or tap one below"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              aria-label="Terminal command input"
            />
          </div>
        </div>
      </motion.div>

      <div className="terminalChips">
        {CHIPS.map((c) => (
          <button
            key={c}
            type="button"
            className="terminalChip"
            onClick={() => submit(c)}
          >
            {c}
          </button>
        ))}
      </div>
    </section>
  );
}
