import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { SplitText } from '../motion/SplitText';
import { drawX, EASE_OUT, VIEWPORT } from '../motion/presets';
import styles from './SectionHeader.module.css';

type SectionHeaderProps = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  /** `split`: title left, lede right. `stack`: everything in one column (sidebars). */
  layout?: 'split' | 'stack';
  children?: ReactNode;
};

/** Numbered section opener: rule draws in, eyebrow fades, title rises word by word. */
export function SectionHeader({ index, eyebrow, title, lede, layout = 'split', children }: SectionHeaderProps) {
  return (
    <motion.div className={`${styles.header} ${styles[layout]}`} initial="hidden" whileInView="show" viewport={VIEWPORT}>
      <motion.span className={styles.rule} variants={drawX} />
      <div className={styles.titleCol}>
        <motion.span
          className={`mono ${styles.eyebrow}`}
          variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT, delay: 0.2 } } }}
        >
          <span>{index}</span>
          <span>{eyebrow}</span>
        </motion.span>
        <SplitText className="h2" delay={0.15}>
          {title}
        </SplitText>
      </div>
      {lede && (
        <motion.p
          className={`lede ${styles.lede}`}
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT, delay: 0.35 } } }}
        >
          {lede}
        </motion.p>
      )}
      {children}
    </motion.div>
  );
}
