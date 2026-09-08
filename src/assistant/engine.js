/**
 * Answer engine for the portfolio assistant.
 *
 * Pure and deterministic: given a question it returns one answer assembled
 * exclusively from the verified knowledge base and (for project deep-dives)
 * the live records from `src/data/projects.js`. There is no network call and
 * no model in the loop, so it cannot invent facts — if the knowledge base has
 * no answer, it says the information is not available and points elsewhere.
 *
 * Answer text uses three lightweight tokens that Assistant.jsx renders:
 *   **bold**            emphasis
 *   [label](url)        link (a url starting with "#" scrolls to a section)
 *   lines starting "- " grouped into a bulleted list
 */

import {
  profile,
  stats,
  journey,
  education,
  experience,
  certifications,
  achievements,
  codingProfiles,
  contact,
  sections,
  skillCatalog,
  skillAreas,
  siteTech,
  siteFeatures,
} from "./knowledge.js";

/* ------------------------------------------------------------------ */
/* Small formatting helpers                                            */
/* ------------------------------------------------------------------ */

const bold = (s) => `**${s}**`;
const link = (label, url) => `[${label}](${url})`;
const bullets = (items) => items.map((i) => `- ${i}`).join("\n");
const para = (...lines) => lines.filter(Boolean).join("\n");

/* ------------------------------------------------------------------ */
/* Query normalisation & matching                                      */
/* ------------------------------------------------------------------ */

const normalize = (raw) =>
  raw
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^a-z0-9+#. ]/g, " ") // keep letters, digits, + # . and spaces
    .replace(/\s+/g, " ")
    .trim();

const spaced = (s) => ` ${s} `;

/** Token-boundary substring test: "react" matches "react" but not "reaction". */
const hasAny = (q, candidates) =>
  candidates.map(normalize).filter(Boolean).some((c) => spaced(q).includes(spaced(c)));

/** Word-prefix test for stems: "certif" matches certification/certified. */
const hasStemAny = (q, stems) => {
  const tokens = q.split(" ");
  return stems.some((s) => tokens.some((t) => t.startsWith(s)));
};

/** Every catalogue entry whose alias appears in the query. */
const matchedSkills = (q) => skillCatalog.filter((s) => hasAny(q, s.aliases));

const topSkill = (q) => {
  const hits = matchedSkills(q);
  if (!hits.length) return null;
  const score = (s) => s.aliases.filter((a) => spaced(q).includes(spaced(normalize(a)))).length;
  return hits.sort((a, b) => score(b) - score(a))[0];
};

const projectRefWords = [
  "cloudcompare ai", "cloud compare ai", "cloudcompareai", "compare ai",
  "cloudcompare", "sridhar rush", "car game", "racing game",
  "multiplayer car", "phone is the controller",
];
const hasProjectRef = (q) => hasAny(q, projectRefWords);

/** A pure greeting has no question marker and stays short. */
const QUESTION_MARKERS = [
  "what", "which", "who", "where", "why", "how can", "how do", "how to",
  "tell", "about", "does", "do you", "are you", "is he", "can you",
  "built", "used", "use", "know", "have", "has",
  "certif", "skill", "project", "experience", "role", "contact", "intern",
  "college", "github", "linkedin", "achievement", "education", "job",
  "location", "phone", "resume", "cv", "email", "mail", "whoami",
];
const GREETING_WORDS = [
  "hi", "hello", "hey", "namaste", "howdy", "yo", "greetings",
  "good morning", "good evening", "good afternoon",
];
const SMALLTALK = [
  "how are you", "how r u", "how are you doing", "how's it going",
  "how is it going", "whats up", "what's up", "sup", "how do you do",
];
const isSmallTalk = (q) => q.split(" ").length <= 6 && hasAny(q, SMALLTALK);
const isPureGreeting = (q) => {
  const wordCount = q.split(" ").length;
  if (wordCount > 4) return false;
  if (!hasAny(q, GREETING_WORDS)) return false;
  return !hasAny(q, QUESTION_MARKERS);
};

/* ------------------------------------------------------------------ */
/* Intent handlers — each returns a string answer or null              */
/* ------------------------------------------------------------------ */

/** Per-skill answer: what it is, the site's evidence, and the project(s). */
function skillAnswer(skill, q, liveProjects) {
  const out = [];
  out.push(`${bold(skill.name)} — ${skill.area}.`);
  out.push("");
  out.push(skill.evidence);

  const proved = skill.projects ?? [];
  if (proved.length) {
    out.push("");
    out.push("Where it appears on this site:");
    out.push(
      bullets(
        proved.map((id) => {
          const p = liveProjects.find((x) => x.id === id);
          if (!p) return `${link("Projects section", "#projects")} (${id})`;
          const links = [p.demo ? link("Live demo", p.demo) : null, link("Code", p.link)]
            .filter(Boolean)
            .join(" · ");
          return `${bold(p.title)} — ${links}`;
        })
      )
    );
  } else if (skill.key !== "git") {
    out.push("");
    out.push("He lists it as a skill, but no featured project on this site demonstrates it — so I won't claim project usage that isn't shown.");
  }

  // A plain "what is his GitHub?" question wants the profile link itself.
  if (skill.key === "git" && !hasAny(q, ["project", "used", "use"])) {
    out.push("");
    out.push(`His GitHub profile: ${link("github.com/yathamsridharreddy", contact.github)}`);
  }

  out.push("");
  out.push(`See the ${link("Skills section", "#skills")} for the interactive list.`);
  return para(...out);
}

/** Full case-study answer assembled from a live project record. */
function describeProject(p) {
  const out = [];
  out.push(`${bold(p.title)} — ${p.tagline}.`);
  out.push("");
  out.push(`*${p.focus}*`);
  out.push("");
  out.push(`**What it is:** ${p.desc}`);

  if (p.tags?.length) {
    out.push("");
    out.push(`**Technology stack:** ${p.tags.join(" · ")}`);
  }

  if (p.architecture?.flow?.length) {
    out.push("");
    out.push("**Architecture:**");
    out.push(
      bullets(
        p.architecture.flow.map((n) => {
          const tech = n.tech ? ` — ${n.tech}` : "";
          return `${bold(n.label)}: ${n.sub}${tech}`;
        })
      )
    );
    if (p.architecture.infra?.length) {
      out.push("");
      out.push(`*${p.architecture.infraLabel ?? "Hosting & delivery"}: ${p.architecture.infra.join(" · ")}.*`);
    }
    if (p.architecture.caption) out.push(`*${p.architecture.caption}*`);
  }

  if (p.breakdown?.length) {
    out.push("");
    out.push("**Engineering breakdown:**");
    out.push(
      bullets(
        p.breakdown
          .filter((row) => row.k !== "Key engineering decisions")
          .map((row) => {
            const v = Array.isArray(row.v) ? row.v.join("; ") : row.v;
            return `${bold(row.k)} — ${v}`;
          })
      )
    );
    const decisions = p.breakdown.find((row) => row.k === "Key engineering decisions");
    if (decisions && Array.isArray(decisions.v)) {
      out.push("");
      out.push(bold("Key engineering decisions:"));
      out.push(bullets(decisions.v));
    }
  }

  out.push("");
  out.push("**Links:** " + [p.demo ? link("Live demo", p.demo) : null, link("View code", p.link)].filter(Boolean).join(" · "));
  return out.join("\n");
}

const handle = {
  empty() {
    return "Ask me anything about Sridhar — his skills, projects, certifications, experience or the roles he's looking for.";
  },

  help() {
    return para(
      "I can answer from the data on this site about:",
      "",
      bullets([
        `${bold("Profile & roles")} — who he is and what he's looking for`,
        `${bold("Projects")} — purpose, stack, architecture, engineering decisions`,
        `${bold("Skills")} — and which project proves each one`,
        `${bold("Credentials")} — certifications, education, achievements`,
        `${bold("Contact")} — email, phone, LinkedIn, resume`,
      ]),
      "",
      "Try one of the suggested questions below, or type your own."
    );
  },

  greeting() {
    return `Hi there! 👋 I'm the assistant for ${profile.shortName}'s portfolio. Ask me about his projects, skills, certifications, experience or what roles he's after — everything I answer comes from this site.`;
  },

  smalltalk() {
    return "Doing great, thanks for asking! I'm here to answer anything about Sridhar's portfolio — his projects, skills, certifications, or the roles he's after.";
  },

  identity() {
    return para(
      "I'm an on-page assistant for this portfolio. I answer questions about Yatham Sridhar Reddy using only the information on this site — no guessing, and if something isn't here I'll tell you.",
      "",
      `You can also ${link("download his resume", contact.resume)} or jump to ${link("contact", "#contact")}.`
    );
  },

  thanks() {
    return "You're welcome! Ask me anything else about his projects, skills or experience — or use the contact section to reach him directly.";
  },

  certifications(q) {
    if (!hasStemAny(q, ["certif"]) && !hasAny(q, ["credly", "credential", "credentials", "badge", "badges", "certs", "credentialed"])) return null;
    const rows = certifications.map(
      (c) =>
        `- ${bold(c.title)} — ${c.org}. ${c.desc} ${link("Verify on Credly", c.verify)} · ${link("PDF", c.pdf)}`
    );
    return para(
      `He holds **${certifications.length} certifications**:`,
      "",
      rows.join("\n"),
      "",
      `All are verified on ${link("Credly", contact.credly)} — full details in the ${link("Certifications section", sections.certifications.url)}.`
    );
  },

  contact(q) {
    if (!hasAny(q, ["contact", "email", "mail", "reach", "phone", "number", "call", "linkedin", "get in touch", "inbox", "hire"])) return null;
    if (hasAny(q, ["leetcode", "codechef", "hackerrank", "coding profile"])) return null;
    return para(
      "Here's how you can reach him:",
      "",
      bullets([
        `${bold("Email:")} ${contact.email}`,
        `${bold("Phone:")} ${contact.phone}`,
        `${bold("LinkedIn:")} ${link("yatham-sridhar-reddy", contact.linkedin)}`,
        `${bold("GitHub:")} ${link("github.com/yathamsridharreddy", contact.github)}`,
        `${bold("Resume:")} ${link("Download PDF", contact.resume)}`,
      ]),
      "",
      `There's also a message form in the ${link("Contact section", "#contact")}. He's actively seeking cloud and DevOps opportunities.`
    );
  },

  roles(q) {
    const asked =
      hasAny(q, [
        "role", "roles", "open to", "looking for", "seeking", "objective",
        "career", "position", "recruiter", "hiring", "full time", "full-time",
        "job", "hire him for", "target", "what does he want",
      ]) || hasStemAny(q, ["opportunit", "recruit"]);
    if (!asked) return null;

    const core = () =>
      para(
        `${bold("He's open to Full-Stack & Cloud/DevOps roles.")} His headline is ${profile.headline}, and his rotating titles are ${profile.rotatingTitles.join(", ")}.`,
        "",
        `His tagline: “${profile.tagline}”`,
        "",
        `His goal: ${profile.goal.toLowerCase()} (${link("About section", "#about")})`,
        "",
        `He's actively seeking cloud and DevOps opportunities — ${link("contact him", "#contact")} directly.`
      );

    // Specific role types that aren't on the site get an honest "not stated".
    if (hasAny(q, ["data science", "data scientist", "machine learning", "ml engineer", "ai engineer", "designer", "ux", "marketing", "sales", "manager", "qa", "tester", "testing role"])) {
      return para(
        "That specific role isn't mentioned anywhere on his portfolio, and I only answer from what's here — so I won't claim it.",
        "",
        "What the site does state:",
        "",
        bullets([
          `**Open to Full-Stack & Cloud/DevOps roles** (his availability badge and headline).`,
          `**Self-described titles:** ${profile.rotatingTitles.join(", ")}.`,
          `**Goal:** ${profile.goal.toLowerCase()}.`,
        ]),
        "",
        `${link("Contact him", "#contact")} to ask about a specific opportunity.`
      );
    }
    return core();
  },

  resume(q) {
    if (!hasAny(q, ["resume", "cv", "curriculum", "download resume"])) return null;
    return `His latest resume is available as a PDF: ${link("Download resume", contact.resume)}. It covers the same experience, education, projects and certifications shown across this site.`;
  },

  location(q) {
    if (!hasAny(q, ["where is he from", "where is he based", "where is he located", "where does he live", "location", "based in", "his city", "country", "from india", "he from", "he based", "located"])) return null;
    return para(
      "The site doesn't state a current city. What it does show: a +91 phone number and the Andhra Pradesh intermediate board, so he's based in India. For anything more specific, the contact section is the best route.",
      "",
      `${link("Contact", "#contact")} · ${link("Education", "#education")}`
    );
  },

  projectQuestion(q, liveProjects) {
    if (!hasProjectRef(q)) return null;
    const p = liveProjects.find(
      (x) =>
        x.id === "cloudcompare-ai" &&
        hasAny(q, ["cloudcompare ai", "cloud compare ai", "cloudcompareai", "compare ai", "cloudcompare"])
    ) ?? liveProjects.find(
      (x) =>
        x.id === "sridhar-rush" &&
        hasAny(q, ["sridhar rush", "car game", "racing game", "multiplayer car", "phone is the controller", "rush"])
    );
    if (!p) {
      return `I can't find that project's record here. Ask about ${bold("CloudCompare AI")} or ${bold("Sridhar Rush")}, or browse the ${link("Projects section", "#projects")}.`;
    }
    return describeProject(p);
  },

  projectsList(q) {
    if (!hasAny(q, ["project", "projects", "featured work", "case study", "what has he built", "what has he made", "showcase", "built anything", "his work"])) return null;
    return para(
      "He has two featured projects:",
      "",
      bullets([
        `${bold("CloudCompare AI")} — multi-cloud comparison & recommendation platform (React · Spring Boot · AWS · Terraform · Docker · Jenkins). ${link("Demo", "https://cloud-compareai.vercel.app/")} · ${link("Code", "https://github.com/yathamsridharreddy/CLOUD-COMPARE-AI")}`,
        `${bold("Sridhar Rush")} — real-time multiplayer racing, phone-as-gamepad over a 30Hz WebSocket relay (Node.js · Three.js · Supabase). ${link("Demo", "https://sridhar-drift.vercel.app/")} · ${link("Code", "https://github.com/yathamsridharreddy/MULTIPLAYER-CAR-GAME")}`,
      ]),
      "",
      `Ask “tell me about CloudCompare AI” for a full deep-dive, or see the ${link("Projects section", "#projects")}.`
    );
  },

  projectsUsingTech(q, liveProjects) {
    if (!hasAny(q, ["project", "projects", "which project", "built with", "where did", "where has", "where was", "where is"])) return null;
    const skill = topSkill(q);
    if (!skill) return null;
    return skillAnswer(skill, q, liveProjects);
  },

  specificTech(q, liveProjects) {
    const skill = topSkill(q);
    if (!skill) return null;
    return skillAnswer(skill, q, liveProjects);
  },

  backendTech(q) {
    if (!hasAny(q, ["backend", "back-end", "back end", "server side", "server-side", "api development"])) return null;
    return para(
      "Backend technologies used across his projects:",
      "",
      bullets([
        `**Spring Boot** (Java 21) powers CloudCompare AI — REST API, Spring Security + JWT, rate limiting, Caffeine cache, JPA/Hibernate.`,
        `**Node.js + Express + ws** power Sridhar Rush's authoritative 30Hz relay.`,
        `**Databases:** Amazon RDS MySQL (CloudCompare AI) and Supabase Postgres (Sridhar Rush, optional).`,
      ]),
      "",
      `Details in the ${link("Projects section", "#projects")}.`
    );
  },

  frontendTech(q) {
    if (!hasAny(q, ["frontend", "front-end", "front end", "client side", "client-side", "ui", "user interface"])) return null;
    return para(
      "Frontend technologies across his work:",
      "",
      bullets([
        `**React** — CloudCompare AI's frontend is React 19 (Vite, Axios, Chart.js); this portfolio itself is React 18.`,
        `**Three.js** (r128) — Sridhar Rush's 3D rendering, vanilla ES6, with a PWA Service Worker.`,
        `**HTML & CSS** — IT Specialist certified (Certiport); used across both projects.`,
      ]),
      "",
      `See the ${link("Skills section", "#skills")} for the full picture.`
    );
  },

  databaseTech(q) {
    if (!hasAny(q, ["database", "databases", "db", "data store", "persistence", "sql", "nosql"])) return null;
    return para(
      "Databases that appear on the site:",
      "",
      bullets([
        `**Amazon RDS for MySQL** — CloudCompare AI's private production database (Spring Data JPA / Hibernate 6).`,
        `**Supabase Postgres** — Sridhar Rush's accounts, leaderboards and ghost laps (optional by design).`,
        `**H2** — local and test runs for CloudCompare AI.`,
        `**MongoDB** — he holds the MongoDB Associate Developer certification; no featured project uses it.`,
      ]),
      "",
      `Full details in the ${link("Projects section", "#projects")}.`
    );
  },

  skillsOverview(q) {
    const whole = hasAny(q, [
      "skill", "skills", "technology", "technologies", "tech stack",
      "stack", "languages", "tools", "knows", "what does he know",
    ]);
    const stems = hasStemAny(q, ["technolog", "skill", "languag", "tool", "know", "stack"]);
    if (!whole && !stems) return null;
    return para(
      "Here's his skill set as grouped on the site:",
      "",
      skillAreas.map((area) => `- ${bold(area.name)}: ${area.skills.join(", ")}`).join("\n"),
      "",
      "Ask “what does he use Terraform for?” and I'll tell you exactly where a skill is proven.",
      "",
      `See the ${link("Skills section", "#skills")} for interactive proof chips.`
    );
  },

  awsExperience(q) {
    if (!hasAny(q, ["aws", "amazon"]) || !hasAny(q, ["experience", "background", "intern", "done with", "used", "work"])) return null;
    return para(
      bold("His AWS experience, verified across the site:"),
      "",
      bullets([
        `**Certified:** AWS Certified Developer – Associate (${link("verify on Credly", certifications[0].verify)}).`,
        `**Internship:** AWS Cloud Intern at Technical Hub Pvt Ltd (May–June 2025) — EC2 inside custom VPCs, IAM roles and access policies.`,
        `**Project:** CloudCompare AI runs on AWS — React build on S3 behind API Gateway, Dockerised Spring Boot on EC2, private RDS MySQL — provisioned end to end with Terraform and shipped through Jenkins.`,
        `**Foundation:** Linux administration, networking and core AWS services; currently going deeper on Kubernetes and observability in multi-account AWS environments.`,
      ]),
      "",
      `${link("Experience section", "#experience")} · ${link("Certifications", "#certifications")} · ${link("Projects", "#projects")}`
    );
  },

  experience(q) {
    if (!hasAny(q, ["experience", "intern", "work history", "professional", "worked at", "work experience"])) return null;
    const e = experience;
    return para(
      `His listed experience is one role:`,
      "",
      `- ${bold(`${e.role} — ${e.company}`)} (${e.kind}, ${e.period})`,
      bullets(e.bullets),
      "",
      `${link("View internship certificate", e.certificate)} · ${link("Experience section", "#experience")} · ${link("Journey section", "#journey")}`
    );
  },

  education(q) {
    if (!hasAny(q, ["education", "college", "university", "degree", "b.tech", "btech", "b tech", "academics", "school", "cgpa", "study", "studies", "intermediate", "where did he study"])) return null;
    return para(
      "Education:",
      "",
      bullets(
        education.map((e) => `${bold(e.institution)} — ${e.degree}, ${e.period}. ${e.metric}.`)
      ),
      "",
      `See the ${link("Education section", "#education")}.`
    );
  },

  journey(q) {
    if (!hasAny(q, ["journey", "timeline", "milestone", "history", "how did he get", "path", "roadmap", "progress", "background story"])) return null;
    return para("His journey, as told on the site:", "", bullets(journey), "", link("Journey section", "#journey"));
  },

  achievements(q) {
    if (!hasAny(q, ["achievement", "achievements", "hackathon", "sih", "hacksprint", "award", "competition", "recognition", "smart india"])) return null;
    return para(
      "Achievements:",
      "",
      bullets(achievements.map((a) => `- ${bold(a.title)} — ${a.rank}. ${a.desc}`)),
      "",
      `See the ${link("Achievements section", "#achievements")}.`
    );
  },

  codingProfiles(q) {
    if (!hasAny(q, ["coding profile", "coding profiles", "leetcode", "codechef", "hackerrank", "competitive programming", "problem solving profile"])) return null;
    return para(
      "His competitive programming profiles:",
      "",
      bullets(codingProfiles.map((p) => `- ${bold(p.name)} — ${link(`@${p.handle}`, p.url)}`)),
      "",
      `See the ${link("Coding Profiles section", "#coding-profiles")}.`
    );
  },

  aboutProfile(q) {
    if (!hasAny(q, ["about", "who is", "tell me about", "profile", "summary", "bio", "background", "whoami", "introduce", "overview"])) return null;
    if (hasProjectRef(q)) return null; // handled by the project deep-dive
    return para(
      `${bold(profile.name)} — ${profile.headline}. ${profile.availability}.`,
      "",
      profile.aboutSummary,
      "",
      `${bold("Quick facts:")}`,
      "",
      bullets([
        `CGPA **${stats[0].value}** · ${stats[1].value} cloud projects shipped · ${stats[2].value} certifications`,
        `AWS Cloud Intern at Technical Hub Pvt Ltd (2025)`,
        `B.Tech Computer Science, Aditya College of Engineering and Technology (2023–2027)`,
      ]),
      "",
      `${link("About section", "#about")} · ${link("Resume", contact.resume)}`
    );
  },

  siteStack(q) {
    if (!hasAny(q, ["built with", "site built", "what is this site", "this website", "this portfolio", "how was this", "what powers", "what tech does this"])) return null;
    return para("This portfolio is a static single-page app:", "", bullets(siteTech), "", "No backend and no secrets in the client — every dynamic feature calls a public API directly from the browser.");
  },

  siteFeatures(q) {
    if (!hasAny(q, ["easter egg", "hidden", "fun", "konami", "chaos", "command palette", "palette", "play with", "interactive", "cool feature", "what can i do here", "try on this site"])) return null;
    return para(
      "This portfolio doubles as a demo of the skills it advertises. Try:",
      "",
      bullets(siteFeatures),
      "",
      "The chaos drill also answers to the Konami code (↑↑↓↓←→←→BA)."
    );
  },

  fallback() {
    return para(
      "I couldn't find that in his portfolio — and I only answer from what's actually on this site, so I won't guess.",
      "",
      "Things I can tell you about:",
      "",
      bullets([
        "**Profile** — who he is and the roles he's open to",
        "**Projects** — CloudCompare AI and Sridhar Rush deep-dives",
        "**Skills** — what he uses and where each one is proven",
        "**Certifications, education, achievements, contact**",
      ]),
      "",
      `Try one of the suggested questions, ${link("download his resume", contact.resume)}, or ${link("contact him", "#contact")} directly.`
    );
  },
};

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

/**
 * Answer a question.
 * @param {string} rawQuestion
 * @param {{ liveProjects?: Array<object> }} opts — optional live records
 *        from src/data/projects.js, used so project answers can never
 *        drift from what the Projects section shows.
 * @returns {{ text: string }}
 */
export function answerQuestion(rawQuestion, opts = {}) {
  const liveProjects = opts.liveProjects ?? [];
  const q = normalize(rawQuestion || "");

  if (!q) return { text: handle.empty() };

  // Meta / conversation first — but only when nothing else is being asked.
  if (hasAny(q, ["help", "what can you", "what can i ask", "how do i use", "commands", "show me around"])) return { text: handle.help() };
  if (hasAny(q, ["who are you", "your name", "are you a bot", "are you ai", "what are you", "an ai"])) return { text: handle.identity() };
  if (isSmallTalk(q)) return { text: handle.smalltalk() };
  if (isPureGreeting(q)) return { text: handle.greeting() };

  // Credentials first, so "is he AWS certified?" never reads as a skill query.
  {
    const t = handle.certifications(q);
    if (t) return { text: t };
  }

  // Project questions before anything else content-related.
  if (hasProjectRef(q)) return { text: handle.projectQuestion(q, liveProjects) };

  // "Which/what projects use <tech>?" before the plain skill answer.
  {
    const t = handle.projectsUsingTech(q, liveProjects);
    if (t) return { text: t };
  }

  // AWS experience is a headline story on this site — give it its own answer.
  {
    const t = handle.awsExperience(q);
    if (t) return { text: t };
  }

  if (hasAny(q, ["backend", "back-end", "back end", "server-side", "server side"])) {
    const t = handle.backendTech(q);
    if (t) return { text: t };
  }
  if (hasAny(q, ["frontend", "front-end", "front end", "client-side", "client side"])) {
    const t = handle.frontendTech(q);
    if (t) return { text: t };
  }
  if (hasAny(q, ["database", "databases", "persistence", "data store"])) {
    const t = handle.databaseTech(q);
    if (t) return { text: t };
  }

  // Specific skill mentions ("what does he use React for?").
  {
    const t = handle.specificTech(q, liveProjects);
    if (t) return { text: t };
  }

  // "Does he know <technology>?" where that technology is NOT in the
  // catalogue must say so honestly instead of listing every skill. (List
  // questions like "what technologies does he know?" stay excluded.)
  if (
    topSkill(q) === null &&
    !hasAny(q, ["what", "which", "list", "all the", "all of", "full list", "summary"]) &&
    hasAny(q, ["does he know", "does he use", "has he used", "did he use", "is he good at", "familiar with", "experienced with", "has he worked with", "worked with", "knows about", "any experience with"])
  ) {
    return {
      text: para(
        "That specific technology doesn't appear anywhere on his portfolio — and I only answer from what's on this site, so I won't claim it.",
        "",
        `His actual skill set is grouped in the ${link("Skills section", "#skills")} — ask “what technologies does he know?” for the full list.`
      ),
    };
  }

  // Generic skill listing.
  {
    const t = handle.skillsOverview(q);
    if (t) return { text: t };
  }

  // Topic handlers — check the most specific question shapes first.
  const topicHandlers = [
    handle.contact,
    handle.roles,
    handle.resume,
    handle.location,
    handle.experience,
    handle.education,
    handle.journey,
    handle.achievements,
    handle.codingProfiles,
    handle.aboutProfile,
    handle.siteStack,
    handle.siteFeatures,
    handle.projectsList,
  ];
  for (const handler of topicHandlers) {
    const t = handler(q);
    if (t) return { text: t };
  }

  // Politeness belongs at the very end so "thanks — what certs?" still gets
  // the certifications answer above.
  if (hasAny(q, ["thank", "thanks", "thx", "appreciate", "grateful"])) {
    return { text: handle.thanks() };
  }

  return { text: handle.fallback() };
}

/** Welcome bubble shown when the panel opens fresh or is cleared. */
export function welcomeText() {
  return para(
    `Hi, I'm the assistant for ${profile.name}'s portfolio. 👋`,
    "",
    "Ask me about his projects, skills, certifications, experience, or the roles he's after — every answer is drawn only from what's on this site.",
    "",
    "Try one of the questions below, or type your own."
  );
}
