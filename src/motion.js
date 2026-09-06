// ===== Motion system =====
// Shared easing curves, durations and variants so every animation on the site
// belongs to the same family. Import these instead of hand-writing transitions.

/** Easing curves. `out` is an expo-out — the "expensive" feeling curve. */
export const ease = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  soft: [0.25, 0.46, 0.45, 0.94],
};

/** Spring presets. */
export const spring = {
  gentle: { type: "spring", stiffness: 140, damping: 22, mass: 0.9 },
  base: { type: "spring", stiffness: 260, damping: 28 },
  snappy: { type: "spring", stiffness: 420, damping: 34 },
  bouncy: { type: "spring", stiffness: 300, damping: 18 },
};

/** Duration tokens, in seconds. */
export const dur = {
  fast: 0.28,
  base: 0.5,
  slow: 0.8,
  slower: 1.2,
};

/** Default viewport config — animate once, slightly before fully in view. */
export const viewport = { once: true, margin: "-80px" };

// ===== Variants =====

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: dur.base, ease: ease.out } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: dur.base, ease: ease.out } },
};

export const fadeDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: dur.base, ease: ease.out } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: dur.base, ease: ease.out } },
};

/** Card entrance — a touch of lift and scale, springy settle. */
export const cardIn = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: spring.gentle },
};

/** Text revealed from behind a mask, rising into place. Needs a clipping parent. */
export const maskRise = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: dur.slow, ease: ease.out } },
};

/** Slide in from a side. */
export const slideIn = (from = "left", distance = 32) => ({
  hidden: { opacity: 0, x: from === "left" ? -distance : distance },
  visible: { opacity: 1, x: 0, transition: { duration: dur.base, ease: ease.out } },
});

/** Parent container that staggers its children. */
export const stagger = (children = 0.07, delay = 0.05) => ({
  hidden: {},
  visible: { transition: { staggerChildren: children, delayChildren: delay } },
});

// ===== Reduced motion =====

/**
 * Strips movement from a variant set, keeping only the opacity fade.
 * Use with framer-motion's useReducedMotion().
 */
export const flatten = (variants) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: dur.fast } },
});

/** Picks between a full variant and its reduced-motion equivalent. */
export const motionSafe = (reduced, variants) =>
  reduced ? flatten(variants) : variants;

// ===== Additional entrances =====
// Used to give each section family its own character instead of every grid
// sharing one card reveal.

/** Springy pop — good for badges, icons and small tiles. */
export const popIn = {
  hidden: { opacity: 0, scale: 0.82 },
  visible: { opacity: 1, scale: 1, transition: spring.bouncy },
};

/** Tilts up into place around the X axis. Needs perspective on the parent. */
export const flipIn = {
  hidden: { opacity: 0, rotateX: -14, y: 22 },
  visible: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    transition: { duration: dur.slow, ease: ease.out },
  },
};

/** A single word rising out of its mask. Pair with `stagger` on the parent. */
export const wordRise = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: dur.slow, ease: ease.out } },
};

/** Card entrance that also comes in from a side — alternate per column. */
export const cardInFrom = (from = "left", distance = 40) => ({
  hidden: {
    opacity: 0,
    y: 20,
    x: from === "left" ? -distance : distance,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: spring.gentle,
  },
});
