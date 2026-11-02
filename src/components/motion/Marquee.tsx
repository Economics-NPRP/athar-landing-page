import { useRef, type ReactNode } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';

type MarqueeProps = {
  children: ReactNode;
  /** Percent of one copy's width travelled per second. */
  speed?: number;
  className?: string;
};

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/** Endless ticker that speeds up and flips direction with scroll velocity. */
export function Marquee({ children, speed = 2, className }: MarqueeProps) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-1500, 0, 1500], [-4, 0, 4], { clamp: false });
  const direction = useRef(1);
  const x = useTransform(base, v => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const b = boost.get();
    if (b < 0) direction.current = -1;
    else if (b > 0) direction.current = 1;
    base.set(base.get() - direction.current * speed * (delta / 1000) * (1 + Math.abs(b)));
  });

  return (
    <div className={className} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }} aria-hidden="true">
      <motion.div style={{ x, display: 'inline-flex', willChange: 'transform' }}>
        <span style={{ display: 'inline-flex' }}>{children}</span>
        <span style={{ display: 'inline-flex' }}>{children}</span>
      </motion.div>
    </div>
  );
}
