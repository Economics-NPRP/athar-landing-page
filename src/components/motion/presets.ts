/* Shared easing curves, viewport settings and variants for scroll-triggered reveals. */
import type { Variants } from 'motion/react';

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;

/** Reveal once, when a fifth of the element is on screen. */
export const VIEWPORT = { once: true, amount: 0.2 } as const;
export const CLIP_VIEWPORT = { once: true, amount: 0, margin: '0px 0px -10% 0px' } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
};

export const stagger = (step = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
});

/**
 * Media wipes open from the bottom edge. Pair with CLIP_VIEWPORT: IntersectionObserver measures the
 * clipped area, so the start state keeps a sliver visible and the trigger fires on any intersection.
 */
export const clipUp: Variants = {
  hidden: { clipPath: 'inset(99.5% 0% 0% 0%)' },
  show: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.2, ease: EASE_IN_OUT } },
};

/** Horizontal rule draws in from the start edge. */
export const drawX: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.1, ease: EASE_IN_OUT } },
};
