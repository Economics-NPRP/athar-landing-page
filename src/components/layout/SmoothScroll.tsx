import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from 'motion/react';

let lenis: Lenis | null = null;

/** Smooth-scrolls to an in-page anchor, falling back to native scrolling when Lenis is off. */
export function scrollToHash(hash: string) {
  const el = document.querySelector<HTMLElement>(hash);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -72 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

/** Inertial page scrolling (Lenis); paused while the preloader is up. */
export function SmoothScroll({ paused }: { paused: boolean }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: -72 } });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, [reduce]);

  useEffect(() => {
    document.documentElement.style.overflow = paused ? 'hidden' : '';
    if (paused) lenis?.stop();
    else lenis?.start();
  }, [paused]);

  return null;
}
