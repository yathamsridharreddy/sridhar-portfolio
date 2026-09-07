import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  FaMagnifyingGlass,
  FaArrowRight,
  FaMoon,
  FaFilePdf,
  FaEnvelope,
  FaGithub,
  FaAward,
  FaTerminal,
} from "react-icons/fa6";
import { ease } from "../motion";

/**
 * Command palette, on Cmd+K / Ctrl+K.
 *
 * This is the pattern behind GitHub, Vercel, Linear and — more to the point for
 * a cloud profile — Sentry, Datadog and CircleCI. It also solves a real problem
 * here: the site now has thirteen sections and the desktop navbar can only hold
 * eleven before it overflows. The palette reaches all of them.
 *
 * Implemented as a combobox: the input keeps DOM focus the whole time and a
 * virtual highlight moves through the listbox via aria-activedescendant, which
 * is what lets a screen reader announce rows without focus ever leaving.
 */

const go = (id) => () => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const COMMANDS = [
  { id: "n-hero", group: "Navigation", label: "Home", keywords: "top start", run: go("hero") },
  { id: "n-about", group: "Navigation", label: "About", keywords: "bio who", run: go("about") },
  { id: "n-skills", group: "Navigation", label: "Skills", keywords: "stack tech tools", run: go("skills") },
  { id: "n-pipeline", group: "Navigation", label: "Delivery Pipeline", keywords: "ci cd build deploy", run: go("pipeline") },
  { id: "n-journey", group: "Navigation", label: "Journey", keywords: "timeline history", run: go("journey") },
  { id: "n-projects", group: "Navigation", label: "Projects", keywords: "work built portfolio", run: go("projects") },
  { id: "n-activity", group: "Navigation", label: "Live from GitHub", keywords: "commits activity recent shipping", run: go("activity") },
  { id: "n-experience", group: "Navigation", label: "Experience", keywords: "roles internship", run: go("experience") },
  { id: "n-education", group: "Navigation", label: "Education", keywords: "college degree", run: go("education") },
  { id: "n-certs", group: "Navigation", label: "Certifications", keywords: "aws mongodb badge credential", run: go("certifications") },
  { id: "n-profiles", group: "Navigation", label: "Coding Profiles", keywords: "leetcode hackerrank", run: go("coding-profiles") },
  { id: "n-achievements", group: "Navigation", label: "Achievements", keywords: "awards sih", run: go("achievements") },
  { id: "n-terminal", group: "Navigation", label: "Terminal", icon: <FaTerminal />, keywords: "shell console cli", run: go("terminal") },
  { id: "n-contact", group: "Navigation", label: "Contact", keywords: "email hire reach", run: go("contact") },

  {
    id: "a-theme",
    group: "Actions",
    label: "Toggle theme",
    icon: <FaMoon />,
    keywords: "dark light mode appearance",
    run: () => window.dispatchEvent(new CustomEvent("portfolio:toggle-theme")),
  },
  {
    id: "a-resume",
    group: "Actions",
    label: "Open resume",
    icon: <FaFilePdf />,
    keywords: "cv pdf download",
    run: () => window.open("/sridhar_final-resume.pdf", "_blank", "noopener,noreferrer"),
  },
  {
    id: "a-email",
    group: "Actions",
    label: "Copy email address",
    icon: <FaEnvelope />,
    keywords: "mail contact clipboard",
    run: () => navigator.clipboard?.writeText("yathamsridharreddy99@gmail.com"),
  },
  {
    id: "a-github",
    group: "Actions",
    label: "Open GitHub profile",
    icon: <FaGithub />,
    keywords: "code repos source",
    run: () => window.open("https://github.com/yathamsridharreddy", "_blank", "noopener,noreferrer"),
  },
  {
    id: "a-credly",
    group: "Actions",
    label: "Verify certifications on Credly",
    icon: <FaAward />,
    keywords: "badge verify aws",
    run: () => window.open("https://www.credly.com/users/yatham-sridhar-reddy", "_blank", "noopener,noreferrer"),
  },
];

function score(cmd, q) {
  if (!q) return 0;
  const label = cmd.label.toLowerCase();
  const keys = (cmd.keywords || "").toLowerCase();
  if (label.startsWith(q)) return 3;
  if (label.includes(q)) return 2;
  if (keys.includes(q)) return 1;
  return -1;
}

export default function CommandPalette() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [isMac, setIsMac] = useState(false);
  const [repos, setRepos] = useState([]);

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const restoreRef = useRef(null);

  useEffect(() => {
    setIsMac(/mac/i.test(navigator.platform || navigator.userAgent));
  }, []);

  // Repositories arrive from the live GitHub feed, so the palette lists
  // whatever is actually being worked on rather than a hard-coded list.
  useEffect(() => {
    const onRepos = (e) =>
      setRepos(
        (e.detail || []).map((r) => ({
          id: `r-${r.repo}`,
          group: "Repositories",
          label: r.repo,
          icon: <FaGithub />,
          keywords: "repo code github source",
          run: () => window.open(r.url, "_blank", "noopener,noreferrer"),
        }))
      );
    window.addEventListener("portfolio:repos", onRepos);
    return () => window.removeEventListener("portfolio:repos", onRepos);
  }, []);

  const all = useMemo(() => [...COMMANDS, ...repos], [repos]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.map((c) => ({ c, s: score(c, q) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.c);
  }, [query, all]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
    restoreRef.current?.focus?.();
  }, []);

  const openPalette = useCallback(() => {
    restoreRef.current = document.activeElement;
    setOpen(true);
  }, []);

  // Global shortcut. Cmd+K on mac, Ctrl+K elsewhere.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) restoreRef.current = document.activeElement;
          return !o;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // A visible trigger for anyone who will never guess a keyboard shortcut.
  useEffect(() => {
    const onOpen = () => openPalette();
    window.addEventListener("portfolio:open-palette", onOpen);
    return () => window.removeEventListener("portfolio:open-palette", onOpen);
  }, [openPalette]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 20);
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  // Keep the highlighted row visible while arrowing past the fold.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const runActive = () => {
    const cmd = results[active];
    if (!cmd) return;
    close();
    // Let the overlay unmount before scrolling, or the smooth scroll fights it.
    setTimeout(() => cmd.run(), 60);
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(Math.max(0, results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runActive();
    }
  };

  let lastGroup = null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="paletteBackdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            className="palette"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -6 }}
            transition={{ duration: 0.2, ease: ease.out }}
          >
            <div className="paletteInputRow">
              <FaMagnifyingGlass className="paletteSearchIcon" aria-hidden="true" />
              <input
                ref={inputRef}
                className="paletteInput"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Jump to a section, or run an action..."
                role="combobox"
                aria-expanded="true"
                aria-controls="paletteList"
                aria-activedescendant={results[active] ? `pal-${results[active].id}` : undefined}
                aria-label="Search commands"
                autoComplete="off"
                spellCheck="false"
              />
              <kbd className="paletteEsc">esc</kbd>
            </div>

            <div className="paletteList" id="paletteList" role="listbox" ref={listRef}>
              {results.length === 0 && (
                <p className="paletteEmpty">No matching command.</p>
              )}
              {results.map((c, i) => {
                const header = c.group !== lastGroup ? c.group : null;
                lastGroup = c.group;
                return (
                  <div key={c.id}>
                    {header && <p className="paletteGroup">{header}</p>}
                    <div
                      id={`pal-${c.id}`}
                      role="option"
                      aria-selected={i === active}
                      data-active={i === active}
                      className={`paletteItem${i === active ? " is-active" : ""}`}
                      onMouseEnter={() => setActive(i)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setActive(i);
                        runActive();
                      }}
                    >
                      <span className="paletteItemIcon" aria-hidden="true">
                        {c.icon || <FaArrowRight />}
                      </span>
                      <span className="paletteItemLabel">{c.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="paletteFooter">
              <span>
                <kbd>↑</kbd> <kbd>↓</kbd> navigate
              </span>
              <span>
                <kbd>↵</kbd> select
              </span>
              <span>
                <kbd>{isMac ? "⌘" : "ctrl"}</kbd> <kbd>K</kbd> toggle
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
