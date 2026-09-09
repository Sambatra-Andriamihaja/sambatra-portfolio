import type { Transition, Variants } from "framer-motion";

/** Bezier vocabulary shared with the CSS layer. */
export const EASE = {
  swift: [0.32, 0.72, 0, 1],
  expo: [0.16, 1, 0.3, 1],
  quart: [0.76, 0, 0.24, 1],
  overshoot: [0.34, 1.56, 0.64, 1],
} as const;

/** The one spring used for anything that should feel like it has mass. */
export const SPRING: Transition = {
  type: "spring",
  stiffness: 150,
  damping: 24,
  mass: 0.9,
};

export const SPRING_SOFT: Transition = {
  type: "spring",
  stiffness: 90,
  damping: 20,
  mass: 1,
};

export const SPRING_SNAP: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 32,
};

/** Parent orchestrator — children resolve in a staggered waterfall. */
export const stagger = (
  delayChildren = 0,
  staggerChildren = 0.06,
): Variants => ({
  hidden: {},
  show: {
    transition: { delayChildren, staggerChildren },
  },
});

/** Quiet fade-up. The house entrance — no blur, no theatrics. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE.expo },
  },
};

/** Line-by-line mask reveal — used for display type. */
export const maskLine: Variants = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: 0.95, ease: EASE.expo },
  },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE.expo } },
};

/** Default viewport config so reveals never re-fire on scroll-back. */
export const inView = { once: true, margin: "-10% 0px -10% 0px" } as const;
