/**
 * Verified knowledge base for the portfolio assistant.
 *
 * Every fact in this file was transcribed from content that is actually
 * rendered on the site (Hero, About, Skills, Journey, Projects, Experience,
 * Education, Certifications, Achievements, Coding Profiles, Contact,
 * Terminal) or from public files it links to. Nothing is inferred, estimated
 * or invented: if a fact is not on the site it is simply absent here, and the
 * engine says so instead of guessing.
 *
 * Project deep-dive answers are assembled at runtime from the live
 * `src/data/projects.js` records (see Assistant.jsx), so project facts can
 * never drift from what the Projects section displays.
 */

export const profile = {
  name: "Yatham Sridhar Reddy",
  shortName: "Sridhar",
  headline: "Full-Stack Software Developer | Cloud & DevOps",
  rotatingTitles: [
    "Full-Stack Developer",
    "Cloud & DevOps Engineer",
    "Backend Developer",
    "AWS Developer",
  ],
  availability: "Open to Full-Stack & Cloud/DevOps roles",
  tagline:
    "I build scalable, automated infrastructure on AWS — from CI/CD pipelines to containerised, production-ready deployments.",
  goal: "My goal is to build production-ready systems end to end.",
  aboutSummary:
    "A Full-Stack Software Developer with a Cloud and DevOps specialisation. He builds the whole path an application takes: React front ends, Spring Boot and Node.js services behind them, and the infrastructure they run on — from a multi-cloud comparison platform on AWS (S3, API Gateway, EC2, RDS) provisioned with Terraform and shipped through Jenkins, to a real-time multiplayer game on an authoritative WebSocket relay.",
};

export const stats = [
  { label: "CGPA", value: "8.3" },
  { label: "Cloud projects shipped", value: "2" },
  { label: "Certifications earned", value: "3" },
  { label: "Teams outranked at SIH", value: "300+" },
];

export const journey = [
  "**Foundation** — hands-on Linux administration, networking fundamentals and core AWS services.",
  "**Project** — built Sridhar Rush, a real-time multiplayer racing game with phones as wireless controllers over a 30Hz WebSocket relay.",
  "**Project** — built CloudCompare AI, a multi-cloud comparison platform on Spring Boot and React, provisioned across AWS with Terraform.",
  "**Certified** — earned AWS Certified Developer – Associate, alongside the MongoDB Associate Developer certification.",
  "**Now** — going deeper on Kubernetes and observability, moving from single services to orchestrated, monitored deployments across multi-account AWS environments.",
];

export const education = [
  {
    institution: "Aditya College Of Engineering And Technology",
    degree: "Bachelor of Technology in Computer Science",
    period: "2023 – 2027",
    metric: "CGPA 8.3",
  },
  {
    institution: "Bhashyam Junior College, Guntur",
    degree: "Board of Intermediate Education Andhra Pradesh, MPC",
    period: "2021 – 2023",
    metric: "Score 9.47",
  },
];

export const experience = {
  role: "AWS Cloud Intern",
  company: "Technical Hub Pvt Ltd",
  kind: "Summer Internship",
  period: "May 2025 – June 2025",
  bullets: [
    "Architected and deployed secure AWS infrastructure by configuring EC2 instances within custom VPC networks.",
    "Implemented IAM roles and access policies to enforce secure authentication and controlled server-level permissions.",
    "Built and tested cloud-based client–server models, gaining practical exposure to scalable architecture and real-world deployment strategies.",
  ],
  certificate: "/technical-hub-cert.pdf",
};

export const certifications = [
  {
    title: "AWS Certified Developer – Associate",
    org: "Amazon Web Services Training and Certification",
    desc: "Validates developing, deploying and debugging cloud-native applications on AWS.",
    verify:
      "https://www.credly.com/earner/earned/badge/b6c2f79f-6f9f-466e-9305-befe9506f910",
    pdf: "/aws-developer-associate-cert.pdf",
    skills: ["AWS", "Code Development", "Code Deployment", "Cloud Certification"],
  },
  {
    title: "MongoDB Associate Developer",
    org: "MongoDB",
    desc: "Validates building applications against MongoDB using drivers, indexes and the document model.",
    verify:
      "https://www.credly.com/earner/earned/badge/223f1b98-5876-4ec0-9bd1-fe7f8ea66b7a",
    pdf: "/mongodb-associate-cert.pdf",
    skills: ["MongoDB", "Node.js", "Data Modeling", "CRUD", "JavaScript"],
  },
  {
    title: "IT Specialist — HTML and CSS",
    org: "Certiport",
    desc: "Certified in web development fundamentals.",
    verify:
      "https://www.credly.com/earner/earned/badge/ef7fa949-dfde-4ecd-aa27-4b02b1466e4f",
    pdf: "/html-css-cert.pdf",
    skills: ["HTML", "CSS", "Web Fundamentals"],
  },
];

export const achievements = [
  {
    title: "Smart India Hackathon — Internal Finalist",
    rank: "Top 50 of 300+ teams",
    desc: "Ranked at the campus internal round by developing and pitching an innovative, scalable real-world solution — demonstrating problem-solving, teamwork, rapid prototyping and technical presentation.",
  },
  {
    title: "GeeksforGeeks HackSprint",
    rank: "#6 of 150+ teams",
    desc: "Secured 6th position by designing and delivering a fully functional solution under strict time constraints.",
  },
];

export const codingProfiles = [
  { name: "CodeChef", handle: "yathamsridharr", url: "https://www.codechef.com/users/yathamsridharr" },
  { name: "LeetCode", handle: "yathamsridharreddy", url: "https://leetcode.com/u/yathamsridharreddy/" },
  { name: "HackerRank", handle: "yathamsridhar", url: "https://www.hackerrank.com/profile/yathamsridhar" },
];

export const contact = {
  email: "yathamsridharreddy99@gmail.com",
  phone: "+91 7207580938",
  github: "https://github.com/yathamsridharreddy",
  linkedin: "https://www.linkedin.com/in/yatham-sridhar-reddy-744177374/",
  credly: "https://www.credly.com/users/yatham-sridhar-reddy",
  lead: "Actively seeking cloud and DevOps opportunities; inbox always open.",
  form: "#contact",
  resume: "/sridhar_final-resume.pdf",
};

export const sections = {
  hero: { name: "Hero", url: "#hero" },
  about: { name: "About", url: "#about" },
  skills: { name: "Skills", url: "#skills" },
  pipeline: { name: "Delivery pipeline", url: "#pipeline" },
  journey: { name: "Journey", url: "#journey" },
  projects: { name: "Projects", url: "#projects" },
  activity: { name: "GitHub activity", url: "#activity" },
  experience: { name: "Experience", url: "#experience" },
  education: { name: "Education", url: "#education" },
  certifications: { name: "Certifications", url: "#certifications" },
  codingProfiles: { name: "Coding profiles", url: "#coding-profiles" },
  achievements: { name: "Achievements", url: "#achievements" },
  terminal: { name: "Terminal", url: "#terminal" },
  contact: { name: "Contact", url: "#contact" },
};

/**
 * Skill catalogue. `evidence` states exactly where the site shows the skill
 * being used; projects with no listed proof say so rather than claiming one.
 * Aliases power intent matching for questions like "does he use React?".
 */
export const skillCatalog = [
  {
    key: "react",
    name: "React",
    aliases: ["react", "reactjs", "react js", "react.js"],
    area: "Frontend",
    evidence: "CloudCompare AI's frontend is React 19 (built with Vite), and this portfolio itself is built with React 18.",
    projects: ["cloudcompare-ai"],
  },
  {
    key: "spring",
    name: "Spring Boot",
    aliases: ["spring boot", "springboot", "spring"],
    area: "Backend",
    evidence: "The CloudCompare AI backend is Spring Boot 3.2.5 on Java 21 — Spring Security with JWT, rate limiting, a Caffeine cache, and Spring Data JPA / Hibernate 6.",
    projects: ["cloudcompare-ai"],
  },
  {
    key: "node",
    name: "Node.js & Express",
    aliases: ["node", "nodejs", "node.js", "express", "express.js"],
    area: "Backend",
    evidence: "Sridhar Rush's authoritative relay is Node with Express and ws, ticking at 30Hz. Node.js also appears in his MongoDB Associate Developer skill set.",
    projects: ["sridhar-rush"],
  },
  {
    key: "websocket",
    name: "WebSockets",
    aliases: ["websocket", "websockets", "web socket", "web sockets", "wss"],
    area: "Backend / Real-time",
    evidence: "Sridhar Rush keeps laptop and phone in sync over a 30Hz authoritative WebSocket relay (wss).",
    projects: ["sridhar-rush"],
  },
  {
    key: "threejs",
    name: "Three.js",
    aliases: ["three.js", "threejs", "three", "webgl"],
    area: "Frontend",
    evidence: "Sridhar Rush renders its 3D scenes with Three.js r128 and vanilla ES6.",
    projects: ["sridhar-rush"],
  },
  {
    key: "rest",
    name: "REST APIs",
    aliases: ["rest api", "rest apis", "rest", "api", "apis", "http api", "endpoint", "endpoints"],
    area: "Backend",
    evidence: "CloudCompare AI exposes a Spring Boot REST API through Amazon API Gateway.",
    projects: ["cloudcompare-ai"],
  },
  {
    key: "htmlcss",
    name: "HTML & CSS",
    aliases: ["html", "css", "html5", "html and css"],
    area: "Frontend",
    evidence: "Certified (IT Specialist — HTML and CSS, Certiport) and used across both featured projects' web front ends.",
    projects: ["sridhar-rush", "cloudcompare-ai"],
  },
  {
    key: "javascript",
    name: "JavaScript",
    aliases: ["javascript", "js", "es6", "vanilla js"],
    area: "Languages",
    evidence: "Sridhar Rush is vanilla ES6 JavaScript; it also appears in his MongoDB Associate Developer skill set.",
    projects: ["sridhar-rush"],
  },
  {
    key: "java",
    name: "Java",
    aliases: ["java", "java 21"],
    area: "Languages",
    evidence: "CloudCompare AI's backend runs Java 21.",
    projects: ["cloudcompare-ai"],
  },
  {
    key: "python",
    name: "Python",
    aliases: ["python"],
    area: "Languages",
    evidence: "Listed among his languages; no featured project demonstrates it, so I can't point to project usage.",
    projects: [],
  },
  {
    key: "cpp",
    name: "C / C++",
    aliases: ["c/c++", "c++", "c plus plus", "c language", "cpp"],
    area: "Languages",
    evidence: "Listed among his languages; no featured project demonstrates it, so I can't point to project usage.",
    projects: [],
  },
  {
    key: "aws",
    name: "AWS",
    aliases: [
      "aws", "amazon web services", "amazon", "s3", "ec2", "rds",
      "api gateway", "vpc", "iam", "lambda", "cloudfront",
    ],
    area: "Cloud & DevOps",
    evidence:
      "AWS Certified Developer – Associate; an AWS Cloud Internship at Technical Hub Pvt Ltd (EC2 in custom VPCs, IAM roles and policies); and CloudCompare AI provisioned on S3, API Gateway, EC2 and a private RDS MySQL instance with Terraform. His terminal skills file lists EC2, S3, RDS and Lambda under AWS.",
    projects: ["cloudcompare-ai"],
  },
  {
    key: "terraform",
    name: "Terraform",
    aliases: ["terraform", "iac", "infrastructure as code", "infra as code"],
    area: "Cloud & DevOps",
    evidence: "CloudCompare AI is provisioned end to end with Terraform — S3, API Gateway, EC2, RDS and security groups.",
    projects: ["cloudcompare-ai"],
  },
  {
    key: "docker",
    name: "Docker",
    aliases: ["docker", "container", "containers", "containerised", "containerized"],
    area: "Cloud & DevOps",
    evidence: "CloudCompare AI's Spring Boot backend ships as a Docker container on EC2 (installed via EC2 user data).",
    projects: ["cloudcompare-ai"],
  },
  {
    key: "kubernetes",
    name: "Kubernetes",
    aliases: ["kubernetes", "k8s", "kube"],
    area: "Cloud & DevOps",
    evidence: "Listed as a skill, and the Journey section says he is currently going deeper on Kubernetes and observability. No featured project deploys to Kubernetes, so there's no project proof yet.",
    projects: [],
  },
  {
    key: "jenkins",
    name: "Jenkins",
    aliases: ["jenkins", "jenkinsfile"],
    area: "Cloud & DevOps",
    evidence: "A Jenkins pipeline builds and tests CloudCompare AI's backend, gated on SonarQube.",
    projects: ["cloudcompare-ai"],
  },
  {
    key: "sonarqube",
    name: "SonarQube",
    aliases: ["sonarqube", "sonar"],
    area: "Quality",
    evidence: "Quality gate in CloudCompare AI's Jenkins pipeline.",
    projects: ["cloudcompare-ai"],
  },
  {
    key: "ansible",
    name: "Ansible",
    aliases: ["ansible"],
    area: "Cloud & DevOps",
    evidence: "Listed as a skill; no featured project demonstrates it, so I can't point to project usage.",
    projects: [],
  },
  {
    key: "githubactions",
    name: "GitHub Actions",
    aliases: ["github actions", "gh actions"],
    area: "CI/CD",
    evidence: "Listed in his terminal skills file, and the CI workflow for this portfolio repository runs on GitHub Actions.",
    projects: [],
  },
  {
    key: "git",
    name: "Git & GitHub",
    aliases: ["git", "github", "version control"],
    area: "Tools",
    evidence: "Both featured projects are hosted on his GitHub, and the site shows a live feed of his commits.",
    projects: ["sridhar-rush", "cloudcompare-ai"],
  },
  {
    key: "mysql",
    name: "MySQL / SQL",
    aliases: ["mysql", "sql", "rdbms", "relational", "h2", "jpa", "hibernate"],
    area: "Databases",
    evidence: "CloudCompare AI uses Amazon RDS for MySQL (private, behind the backend security group) with Spring Data JPA and Hibernate 6; H2 for local and test runs.",
    projects: ["cloudcompare-ai"],
  },
  {
    key: "supabase",
    name: "Supabase (Postgres)",
    aliases: ["supabase", "postgres", "postgresql"],
    area: "Databases",
    evidence: "Sridhar Rush stores accounts, global leaderboards and shared ghost laps in Supabase Postgres — optional by design, so the game runs without it.",
    projects: ["sridhar-rush"],
  },
  {
    key: "mongodb",
    name: "MongoDB",
    aliases: ["mongodb", "mongo", "document database", "nosql"],
    area: "Databases",
    evidence: "He holds the MongoDB Associate Developer certification (drivers, indexes, document model). No featured project is built on MongoDB.",
    projects: [],
  },
  {
    key: "pwa",
    name: "PWA / Service Worker",
    aliases: ["pwa", "progressive web app", "service worker", "offline"],
    area: "Frontend",
    evidence: "Sridhar Rush is an installable PWA with an offline AI opponent for solo play.",
    projects: ["sridhar-rush"],
  },
  {
    key: "vercel",
    name: "Vercel",
    aliases: ["vercel", "vercel.com"],
    area: "Hosting",
    evidence: "Serves Sridhar Rush's client and CloudCompare AI's frontend (via a demo deployment); this portfolio is hosted on Vercel too.",
    projects: ["sridhar-rush", "cloudcompare-ai"],
  },
  {
    key: "chartjs",
    name: "Chart.js & Axios",
    aliases: ["chart.js", "chartjs", "axios"],
    area: "Frontend",
    evidence: "Used in CloudCompare AI's React frontend — Axios for API calls, Chart.js for comparison views.",
    projects: ["cloudcompare-ai"],
  },
];

/** Grouped overview used for generic "what technologies" questions. */
export const skillAreas = [
  {
    name: "Full-Stack Development",
    skills: ["React", "Spring Boot", "Node.js", "REST APIs", "WebSockets"],
  },
  {
    name: "Languages & Core Stack",
    skills: ["AWS", "Python", "Java", "Git & GitHub", "C / C++", "HTML & CSS"],
  },
  {
    name: "DevOps & Cloud Tools",
    skills: ["Docker", "Kubernetes", "Jenkins", "Terraform", "Ansible"],
  },
  {
    name: "CS Fundamentals",
    skills: ["Operating Systems", "DBMS & SQL", "SDLC", "DSA"],
  },
];

export const siteTech = [
  "**Frontend:** React 18 · Vite 7 · Framer Motion · plain CSS with custom properties",
  "**Live data:** Firebase Realtime Database (view counter) · Formspree (contact form) · GitHub REST API (live commit feed)",
  "**Architecture:** static single-page app — no server runtime; every dynamic feature is a direct browser-to-API call",
  "**CI/CD:** GitHub Actions on this repository",
  "**Hosting:** Vercel",
];

export const siteFeatures = [
  "A **delivery pipeline** that runs as you scroll (#pipeline)",
  "A working **terminal** with real commands (#terminal)",
  "A **live GitHub commit feed** (#activity)",
  "A **command palette** (press ⌘K / Ctrl+K)",
  "A hidden **chaos drill** that stages a production incident and rolls it back",
];

export const suggestedQuestions = [
  "What kind of roles is he looking for?",
  "Tell me about CloudCompare AI",
  "Explain Sridhar Rush",
  "What technologies does he know?",
  "What AWS experience does he have?",
  "What certifications does he have?",
  "How can I contact him?",
];
