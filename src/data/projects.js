import carCover from "../assets/car-game-cover.webp";
import carPoster from "../assets/car-game-poster.webp";
import carArch from "../assets/car-game-architecture.webp";
import cloudCover from "../assets/cloud-compare-cover.webp";

/**
 * Project data.
 *
 * Every fact here is taken from the projects' own repositories — their
 * READMEs, tech-stack tables and Terraform/deployment docs. Nothing is
 * estimated, rounded or inferred. If a field has no evidence in the source
 * repo it is simply absent rather than filled in.
 *
 * The two projects are deliberately presented as equal in weight and
 * different in kind: one is a cloud-deployed full-stack platform, the other a
 * real-time distributed system. `focus` labels that difference so neither
 * reads as the "main" project.
 */

export const projects = [
  {
    id: "sridhar-rush",
    title: "Sridhar Rush",
    tagline: "Real-time multiplayer racing where your phone is the controller",
    focus: "Full-Stack · Real-Time Systems",
    desc: "A real-time 3D racing game that splits the console in two: the laptop renders the race while phones become wireless gamepads over a QR scan, with no install or sign-up. A 30Hz authoritative relay keeps players in sync across the internet, backed by Supabase for leaderboards and ghost laps. Ships five race modes and five circuits, plus an installable PWA build and an offline AI opponent for solo play.",
    tags: [
      "JavaScript",
      "Node.js",
      "Express",
      "WebSockets",
      "Three.js",
      "Supabase",
      "PWA",
      "Vercel",
    ],
    thumb: carCover,
    images: [carPoster, carArch],
    demo: "https://sridhar-drift.vercel.app/",
    link: "https://github.com/yathamsridharreddy/MULTIPLAYER-CAR-GAME",

    architecture: {
      caption: "Phone and laptop both hold a wss connection to an authoritative relay.",
      flow: [
        {
          label: "Browser clients",
          sub: "Laptop renders · phone is the gamepad",
          tech: "Three.js r128 · vanilla ES6 · Service Worker",
        },
        {
          label: "WebSocket relay",
          sub: "Authoritative rooms, physics and boards at 30Hz",
          tech: "Node · Express · ws",
        },
        {
          label: "Supabase Postgres",
          sub: "Accounts, global leaderboards, shared ghost laps",
          tech: "Postgres · optional",
        },
      ],
      infra: ["Vercel", "Railway / Render", "Service Worker", "wss"],
      infraLabel: "Hosting & delivery",
    },

    breakdown: [
      {
        k: "Problem",
        v: "Playing a multiplayer game with someone normally means an install, an account and a controller each. Every one of those is a reason not to bother.",
      },
      {
        k: "Solution",
        v: "Split the console in two. The laptop renders the race; a phone becomes the gamepad by scanning a QR code. No install, no sign-up, no pairing step — just a link.",
      },
      {
        k: "Frontend",
        v: "Three.js r128 with vanilla ES6 for the 3D scene, bloom post-processing and client-side interpolation between server updates. A Service Worker makes it an installable PWA.",
      },
      {
        k: "Backend",
        v: "Node with Express and ws. An authoritative relay owns rooms, physics and leaderboards, ticking at 30Hz so the server — not the client — decides what actually happened.",
      },
      {
        k: "Database",
        v: "Supabase Postgres stores accounts, global leaderboards and shared ghost laps. It is optional by design: with no credentials configured the game still runs end to end.",
      },
      {
        k: "Cloud & delivery",
        v: "Vercel serves the static client with CSP headers, immutable caching and rewrites. The relay runs as a separate service on Railway or Render.",
      },
      {
        k: "Key engineering decisions",
        v: [
          "The relay is authoritative and clients interpolate between its 30Hz updates rather than simulating independently. That is what keeps two players across the internet looking at the same race.",
          "Every external dependency is environment-gated. With zero environment variables set, the game is still fully playable — Supabase, community links and bloom all degrade rather than break.",
          "Phones join over a QR code and a wss connection, which removes the install and the pairing flow that usually kill a casual multiplayer session.",
        ],
      },
    ],
  },

  {
    id: "cloudcompare-ai",
    title: "CloudCompare AI",
    tagline: "Multi-cloud comparison and recommendation platform",
    focus: "Full-Stack · Cloud & DevOps",
    desc: "A full-stack platform that evaluates infrastructure across AWS, Azure, Google Cloud, Oracle Cloud and Alibaba Cloud, weighing compute, storage, pricing estimates, performance and regional availability to produce ranked recommendations by cost or performance priority. The production stack runs a React build on S3 behind API Gateway, with a Dockerised Spring Boot API on EC2 and a private RDS MySQL instance, all provisioned reproducibly through Terraform.",
    tags: [
      "Java 21",
      "Spring Boot",
      "React 19",
      "REST APIs",
      "MySQL",
      "AWS",
      "Terraform",
      "Docker",
      "Jenkins",
    ],
    thumb: cloudCover,
    images: [],
    demo: "https://cloud-compareai.vercel.app/",
    link: "https://github.com/yathamsridharreddy/CLOUD-COMPARE-AI",

    architecture: {
      caption: "Production path on AWS, provisioned end to end with Terraform.",
      flow: [
        {
          label: "React 19 frontend",
          sub: "Production build served from Amazon S3",
          tech: "React · Vite · Axios · Chart.js",
        },
        {
          label: "Amazon API Gateway",
          sub: "Managed HTTPS entrypoint, routing, CORS and throttling",
          tech: "HTTP API",
        },
        {
          label: "Spring Boot REST API",
          sub: "Dockerised container on EC2, port 3000",
          tech: "Java 21 · Spring Boot 3.2.5 · Spring Security + JWT",
        },
        {
          label: "Amazon RDS for MySQL",
          sub: "Private — reachable only from the backend security group",
          tech: "Spring Data JPA · Hibernate 6",
        },
      ],
      infra: ["Terraform", "Docker", "Jenkins", "SonarQube", "S3", "EC2", "RDS", "Security Groups"],
      infraLabel: "Infrastructure & delivery",
    },

    breakdown: [
      {
        k: "Problem",
        v: "Comparing infrastructure across five cloud providers means reconciling five pricing models, five instance families and five regional footprints by hand — and the answer changes depending on whether you are optimising for cost or for performance.",
      },
      {
        k: "Solution",
        v: "A platform that evaluates compute, storage, pricing estimates, performance and regional availability across AWS, Azure, GCP, Oracle Cloud and Alibaba Cloud, then returns ranked recommendations against a chosen priority.",
      },
      {
        k: "Frontend",
        v: "React 19 built with Vite, Axios for API calls and Chart.js for the comparison views. The production build is served as a static site from Amazon S3.",
      },
      {
        k: "Backend",
        v: "Java 21 on Spring Boot 3.2.5 with Spring Web. Stateless authentication through Spring Security and JWT, with rate limiting on the API surface and a Caffeine cache in front of the comparison and ranking services. Groq with LLaMA 3.1 backs the recommendation assistant.",
      },
      {
        k: "Database",
        v: "Amazon RDS for MySQL in production and H2 for local and test runs, accessed through Spring Data JPA and Hibernate 6 so the same persistence layer serves both.",
      },
      {
        k: "Cloud & infrastructure",
        v: "Terraform provisions S3, API Gateway, EC2, RDS and the security groups into the VPC. EC2 user data installs Docker and starts the backend container with its RDS, JWT and CORS configuration injected.",
      },
      {
        k: "CI/CD",
        v: "A Jenkins pipeline builds and tests the backend and gates on SonarQube. Tests are JUnit 5 with Mockito, and coverage is measured with JaCoCo. The backend ships as a Docker image.",
      },
      {
        k: "Key engineering decisions",
        v: [
          "API Gateway sits in front of EC2 so HTTPS termination, CORS and request throttling are managed services rather than instance configuration — no load balancer to run and no certificates on the box.",
          "The browser reads a Terraform-generated runtime config instead of an API URL baked in at build time, so one build artefact works across environments.",
          "RDS is never publicly accessible. MySQL is reachable only from the backend security group, so the database has no route in from the internet.",
          "A second deployment path on Vercel and Render proxies /api through Vercel rewrites, so the frontend calls its own origin and CORS stops being a concern.",
        ],
      },
    ],
  },
];

/** Lookup used by the skills section to jump straight to a project. */
export const projectById = Object.fromEntries(projects.map((p) => [p.id, p]));
