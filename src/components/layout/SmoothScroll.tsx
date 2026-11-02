import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from 'motion/react';

let lenis: Lenis | null = null;

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
