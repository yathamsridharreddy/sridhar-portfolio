import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { FaCodeCommit, FaArrowUpRightFromSquare } from "react-icons/fa6";
import SectionHeading from "./SectionHeading";
import Parallax from "./Parallax";
import { ease } from "../motion";

/**
 * Live commit feed, pulled from the public GitHub REST API at runtime.
 *
 * Deliberately shows commits rather than the usual stars / followers / language
 * widget. Those are vanity metrics, and on this account they read badly: zero
 * stars, one follower, and a language split dominated by HTML from old static
 * repos. The commit history is the genuinely strong signal here, so that is
 * what gets surfaced.
 *
 * Four unauthenticated requests per visitor against a 60/hour per-IP budget,
 * cached in sessionStorage for ten minutes. If anything fails, or the account
 * is rate limited, the whole section unmounts rather than showing a recruiter
 * an empty box.
 */

const USER = "yathamsridharreddy";
const REPOS = ["sridhar-portfolio", "MULTIPLAYER-CAR-GAME", "CLOUD-COMPARE-AI"];
const CACHE_KEY = "gh-activity-v1";
const CACHE_MS = 10 * 60 * 1000;

// Conventional-commit prefixes get their own colour, which quietly advertises
// that the commit history follows a convention at all.
const TYPES = {
  feat: "feat",
  fix: "fix",
  perf: "perf",
  refactor: "refactor",
  chore: "chore",
  docs: "docs",
  style: "style",
  test: "test",
};

function parseMessage(raw) {
  const subject = raw.split("\n")[0].trim();
  const m = subject.match(/^(\w+)(\([^)]*\))?!?:\s*(.+)$/);
  if (m && TYPES[m[1].toLowerCase()]) {
    return { type: TYPES[m[1].toLowerCase()], text: m[3] };
  }
  return { type: null, text: subject };
}

function relTime(iso) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 90) return "just now";
  const units = [
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.35, "week"],
    [12, "month"],
  ];
  let v = s / 60;
  let label = "minute";
  for (let i = 0; i < units.length; i++) {
    if (v < units[i][0]) {
      label = units[i][1];
      break;
    }
    v /= units[i][0];
    label = units[i + 1] ? units[i + 1][1] : "year";
  }
  const n = Math.floor(v);
  return `${n} ${label}${n === 1 ? "" : "s"} ago`;
}

async function fetchActivity() {
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const { at, data } = JSON.parse(cached);
      if (Date.now() - at < CACHE_MS) return data;
    } catch {
      /* fall through and refetch */
    }
  }

  const results = await Promise.all(
    REPOS.map((repo) =>
      fetch(`https://api.github.com/repos/${USER}/${repo}/commits?per_page=5`, {
        headers: { Accept: "application/vnd.github+json" },
      })
        .then((r) => (r.ok ? r.json() : []))
        .then((list) =>
          (Array.isArray(list) ? list : []).map((c) => ({
            sha: c.sha.slice(0, 7),
            url: c.html_url,
            repo,
            date: c.commit.author.date,
            ...parseMessage(c.commit.message),
          }))
        )
        .catch(() => [])
    )
  );

  const commits = results
    .flat()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  if (!commits.length) throw new Error("no commits");

  sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data: commits }));
  return commits;
}

export default function GitHubActivity() {
  const reduced = useReducedMotion();
  const [commits, setCommits] = useState(null);
  const [failed, setFailed] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "160px" });

  // Only spend the request budget once the section is actually approached.
  useEffect(() => {
    if (!inView || commits || failed) return;
    let alive = true;
    fetchActivity()
      .then((d) => alive && setCommits(d))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [inView, commits, failed]);

  // Feed the repo list to the command palette so it can offer them too.
  useEffect(() => {
    if (!commits) return;
    window.dispatchEvent(
      new CustomEvent("portfolio:repos", {
        detail: [...new Set(commits.map((c) => c.repo))].map((repo) => ({
          repo,
          url: `https://github.com/${USER}/${repo}`,
        })),
      })
    );
  }, [commits]);

  if (failed) return null;

  return (
    <section id="activity" className="section activitySection" ref={ref}>
      <Parallax className="sectionGlow at-right" speed={-40} aria-hidden="true" />
      <SectionHeading eyebrow="Still shipping" title="Live from GitHub" />

      <p className="activityIntro">
        Pulled straight from the GitHub API when this page loaded — not a
        screenshot, and not a number I typed in by hand.
      </p>

      <div className="activityFeed">
        {!commits &&
          Array.from({ length: 4 }).map((_, i) => (
            <div className="activityRow is-skeleton" key={`s${i}`} aria-hidden="true">
              <span className="activitySkel w-sm" />
              <span className="activitySkel w-lg" />
            </div>
          ))}

        {commits?.map((c, i) => (
          <motion.a
            key={c.sha + c.repo}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="activityRow"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: ease.out }}
            whileHover={reduced ? undefined : { x: 4 }}
          >
            <span className="activityDot" aria-hidden="true">
              <FaCodeCommit />
            </span>

            <span className="activityMain">
              <span className="activityMsg">
                {c.type && (
                  <span className={`activityType t-${c.type}`}>{c.type}</span>
                )}
                {c.text}
              </span>
              <span className="activityMeta">
                <code>{c.repo}</code>
                <span className="activitySep">·</span>
                <code>{c.sha}</code>
                <span className="activitySep">·</span>
                {relTime(c.date)}
              </span>
            </span>

            <FaArrowUpRightFromSquare className="activityGo" aria-hidden="true" />
          </motion.a>
        ))}
      </div>
    </section>
  );
}
