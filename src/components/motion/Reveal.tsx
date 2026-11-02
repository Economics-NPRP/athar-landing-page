import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'motion/react';
import { EASE_OUT, VIEWPORT } from './presets';

type RevealProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  y?: number;
};

/** Fade-and-rise on scroll into view. */
export function Reveal({ children, className, style, delay = 0, y = 32 }: RevealProps) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}
