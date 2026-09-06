# Repository cleanup audit

A record of the problems found in an audit of this repository and what was done
about each. Kept for reference — nothing here is required to run the site (see
[`../README.md`](../README.md) for that).

---

## Fixed

### 1. `node_modules/` was committed to Git — build broke on every non-Mac host
`.gitignore` listed `node_modules`, but the directory had been committed
*before* that rule existed, so Git still tracked **~3,400 files**. Two
consequences:

- The tracked tree contained only `@rollup/rollup-darwin-arm64`, a macOS
  Apple-Silicon native binary. On Linux CI, Netlify, Vercel or a Windows
  machine, `npm run build` failed immediately with
  `Cannot find module @rollup/rollup-linux-x64-gnu`.
- The tracked copy was also stale: `firebase` was in `package.json` and
  `package-lock.json` but **absent** from `node_modules`, so a fresh clone
  couldn't even start the dev server.

**Fixed:** `git rm -r --cached node_modules`; tracked files went from 3,490 to
under 60. A clean `npm install` + `npm run build` now succeeds.

### 2. `dist/` was committed and stale
Build output shouldn't be versioned, and the committed copy predated the
current source.
**Fixed:** untracked and added to `.gitignore`.

### 3. Junk files tracked at the repo root
Four paths whose *filenames* were leaked AI-tool call fragments and absolute
macOS paths, e.g. `<parameter name="path">/Users/…/Hero.jsx</parameter>` and
`"\n/Users/…/src/App.jsx\n"`, plus four `.DS_Store` files.
**Fixed:** all deleted; `.gitignore` expanded to cover OS/editor cruft, env
files, logs and caches.

### 4. Dead code and unused dependencies
- `src/components/Services.jsx` (149 lines) was never imported by `App.jsx`.
  **Removed** — recoverable with `git log --all -- src/components/Services.jsx`.
- `@emailjs/browser` was a dependency but imported nowhere (the contact form
  uses Formspree). **Removed.**
- ~313 lines of CSS targeting markup that no longer exists: `.flipCard*`,
  `.profileBadge*`, `.certBadge*`, `.serviceCard`/`.serviceGrid`,
  `.skillCard`/`.skillGrid`, `.highlightGrid`, and
  `.achievementIcon svg[aria-label="leetcode"|"codechef"]`. **Removed**, and the
  surviving grouped rules were de-grouped down to just `.card` / `.projectsGrid`.
- Eight project screenshots duplicated at the repo root (the served copies live
  in `public/`). **Removed.**
- `TODO.md`, a fully-completed checklist from an earlier refactor. **Removed.**

### 5. Missing project scaffolding
**Added** `README.md` (stack, setup, project map, a table of where to edit each
piece of content, theming, external services, deploy notes). A CI workflow
running `npm ci && npm run build` — exactly the check that would have caught
issue 1 — is provided as a copy-paste snippet in the README's Deployment
section rather than as a file, because the GitHub App used for these commits
isn't permitted to create `.github/workflows/`. Add it from your own account.

### 6. Theme handling
The theme was component-local state, reset to dark on every reload, and ignored
the OS setting.
**Fixed:** persisted to `localStorage` under `portfolio-theme`; until the
visitor picks explicitly, the site follows `prefers-color-scheme` and reacts to
live changes.

### 7. No mobile navigation
Ten nav links were simply shrunk on small screens, then hidden entirely below
480px with no replacement.
**Fixed:** added a hamburger button and a slide-in drawer (backdrop, body-scroll
lock, Escape to close, closes on link tap). The inline link row now hides below
1024px.

### 8. Head / SEO / assets
`index.html` had no description, no Open Graph or Twitter tags, and a favicon
pointing at a non-existent `/vite.svg`. The stylesheet also asked for the
`Inter` typeface, which was never actually loaded.
**Fixed:** full meta/OG/Twitter block, `theme-color`, canonical URL, a new
`public/favicon.svg`, and the Inter font added to the Google Fonts request.

### 9. Assorted correctness / a11y nits
- `Timeline` ("Journey") had no `id`, so it couldn't be linked to and was
  missing from the nav — **added `id="journey"` and a nav entry.**
- `Projects` used `whileInView` with no `initial`, giving it an inconsistent
  entry animation — **fixed.**
- `ProjectModal` put `role="dialog"`/`aria-modal` on the backdrop rather than
  the dialog box — **moved onto the dialog.**
- Contact links opened `mailto:` and `tel:` in a new tab — **now only real
  external links get `target="_blank"`.**
- Unused `itemVariants` in `Hero.jsx` — **removed.**
- The logo is now an `<a href="#hero">` (back to top) instead of a bare `div`.

### 10. Dev server behind a proxy
`vite.config.js` now reads `VITE_ALLOWED_HOSTS` so the dev server can be used
from Codespaces, a tunnel or a cloud sandbox without editing the config or
loosening the default for everyone.

---

## Not addressed — your call

### Firebase database rules
`src/firebase.js` contains the Firebase web config in plaintext. That is
expected and **not** a leak — web API keys are public by design — but it means
security rests entirely on the Realtime Database rules. If `/views` is
world-writable, anyone can set the counter to any value or write arbitrary data.
A suggested rule set is in the README. **Verify this in the Firebase console.**

### Bundle size
The production bundle is ~563 kB (~162 kB gzipped) and Vite warns about it.
Firebase and `framer-motion` dominate. Options: lazy-load the Firebase counter
with `import()`, or drop Firebase for a lighter counter service.

### Content lives in JSX
Every section hard-codes its content in a `const` at the top of its component.
Moving it all into a single `src/data/` module would mean editing one file
instead of eight to update the résumé. Deliberately left alone — it's a bigger
refactor than a cleanup.

### Still absent
No TypeScript, ESLint/Prettier, or tests. Reasonable for a project this size,
but a linter would be cheap to add.
