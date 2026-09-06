# Sridhar Cloud Portfolio

Personal portfolio site for **Yatham Sridhar Reddy** — a Cloud / DevOps / AWS
focused Computer Science student.

A single-page React application: hero, about, skills, journey, projects,
experience, education, certifications, coding profiles, achievements and a
working contact form.

---

## Tech stack

| Concern | Choice |
|---|---|
| UI | React 18 (single page, no router) |
| Build | Vite 5 + `@vitejs/plugin-react` |
| Styling | One global stylesheet, `src/style.css`, with CSS custom properties and `body.dark` / `body.light` theming |
| Animation | `framer-motion` |
| Icons | `react-icons` (Font Awesome set) |
| Typing effect | `react-type-animation` |
| View counter | Firebase Realtime Database |
| Contact form | Formspree |

---

## Getting started

Requires **Node.js 20+**.

```bash
npm install     # install dependencies
npm run dev     # start the dev server (http://localhost:5173)
```

Other scripts:

```bash
npm run build     # production build into dist/
npm run preview   # serve the built dist/ locally
```

> `node_modules/` and `dist/` are **not** committed. Always run `npm install`
> after cloning.

---

## Project structure

```
index.html                  page shell, meta/OG tags, font + favicon links
vite.config.js              Vite + React plugin
public/                     served verbatim at the site root
  favicon.svg
  sridhar_final-resume.pdf
  *-cert.pdf, *-badge.png   certificates and badges
  project*-image*.jpeg      project screenshots (carousel)
src/
  main.jsx                  React root, imports the global stylesheet
  App.jsx                   renders every section in page order
  firebase.js               Firebase app + Realtime Database init
  style.css                 all global styles
  assets/                   images imported by JS (hashed + bundled by Vite)
    profile1.jpg, car-game-*.webp, cloud-compare-cover.webp
  components/
    Navbar.jsx              fixed nav, theme toggle, scroll-spy, mobile menu
    ViewerCount.jsx         live view counter badge
    Hero.jsx                photo, name, typing roles, resume + contact CTAs
    About.jsx               bio paragraph
    Skills.jsx              three skill categories of animated icon cards
    Timeline.jsx            "Journey" milestones
    Projects.jsx            project cards
    ProjectModal.jsx        architecture diagram + screenshot carousel
    Experience.jsx          internship + certificate link
    Education.jsx           institutions
    Certifications.jsx      certificate and badge modals
    CodingProfiles.jsx      CodeChef / LeetCode / HackerRank links
    Achievements.jsx        hackathon results
    Contact.jsx             contact links + Formspree form
```

---

## Editing the content

All content is hard-coded in the component files, as a `const` array or object
at the top of each one. To update the site, edit the relevant component:

| To change… | Edit |
|---|---|
| Name, roles in the typing animation | `src/components/Hero.jsx` |
| Bio | `src/components/About.jsx` |
| Skills and their brand colours | `categories` in `src/components/Skills.jsx` |
| Journey milestones | `items` in `src/components/Timeline.jsx` |
| Projects (title, description, diagram, screenshots, repo link) | `projects` in `src/components/Projects.jsx` |
| Work experience | `experience` in `src/components/Experience.jsx` |
| Education | `education` in `src/components/Education.jsx` |
| Certifications | `certifications` in `src/components/Certifications.jsx` |
| Coding profile links | `codingProfiles` in `src/components/CodingProfiles.jsx` |
| Achievements | `achievements` in `src/components/Achievements.jsx` |
| Email, phone, socials | `contactInfo` in `src/components/Contact.jsx` |
| Résumé PDF | replace `public/sridhar_final-resume.pdf` |
| Nav links | `navItems` in `src/components/Navbar.jsx` (an entry's `href` must match a section's `id`) |

---

## Theming

The theme is a class on `<body>` (`dark` or `light`), set by `Navbar`. Every
themed rule is written twice in `style.css`:

```css
body.light .thing { /* light values */ }
body.dark  .thing { /* dark values  */ }
```

The visitor's choice is saved to `localStorage` under `portfolio-theme`. Until
they pick one explicitly the site follows the OS `prefers-color-scheme`
setting, defaulting to dark.

---

## External services

### Firebase (view counter)

`src/firebase.js` holds the Firebase web config. These values are **not**
secrets — Firebase web keys are public by design — so the security of the
database depends entirely on its rules. Make sure the Realtime Database rules
only allow a validated increment of `/views`, for example:

```json
{
  "rules": {
    "views": {
      ".read": true,
      ".write": "newData.isNumber() && (!data.exists() || newData.val() === data.val() + 1)"
    },
    "$other": { ".read": false, ".write": false }
  }
}
```

The counter increments once per browser session (guarded by `sessionStorage`)
and fails silently if the database is unreachable.

### Formspree (contact form)

`Contact.jsx` POSTs JSON to a Formspree endpoint. To point it at a different
form, change the URL in `handleSubmit`.

---

## Deployment

The site is a fully static bundle — `npm run build` produces `dist/`, which can
be served by any static host.

| Host | Settings |
|---|---|
| **Netlify / Vercel / Cloudflare Pages** | build command `npm run build`, publish directory `dist` |
| **GitHub Pages** | publish `dist/`; if the site is served from a sub-path, set `base: '/<repo-name>/'` in `vite.config.js` |

> Update the `og:url` and `canonical` values in `index.html` to your real
> deployed URL.

### Recommended CI

Add this as `.github/workflows/ci.yml` to catch a broken build before it reaches
a host — it's the exact check that would have caught the committed macOS-only
`node_modules` that used to break builds everywhere else. (It has to be added
from your own GitHub account; apps can't create workflow files.)

```yaml
name: CI

on:
  push:
    branches: ["**"]
  pull_request:

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
```

---

## Notes

- No TypeScript, linter, or test suite is configured.
- The production JS bundle is ~560 kB (~161 kB gzipped); Firebase and
  `framer-motion` dominate it. Code-splitting or a lighter view counter would
  bring it down.
