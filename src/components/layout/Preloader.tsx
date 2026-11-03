import { useEffect, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { EASE_IN_OUT, EASE_OUT } from '../motion/presets';
import styles from './Preloader.module.css';

const WORD = 'SMARTSS';

/** Intro curtain: counts to 100 while fonts load, then lifts away to reveal the hero. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const progress = useMotionValue(0);
  const pct = useTransform(progress, v => String(Math.round(v)).padStart(3, '0'));
  const scaleX = useTransform(progress, [0, 100], [0, 1]);
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);

  useEffect(() => {
    if (!fontsReady) return;
    const controls = animate(progress, 100, {
      duration: reduce ? 0.2 : 1.8,
      ease: EASE_IN_OUT,
      onComplete: () => setTimeout(onDone, reduce ? 0 : 250),
    });
    return () => controls.stop();
  }, [fontsReady, reduce, progress, onDone]);

  return (
    <motion.div
      className={styles.curtain}
      initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 1.1, ease: EASE_IN_OUT } }}
      role="status"
      aria-label="Loading"
    >
      <motion.div className={styles.inner} exit={{ y: -80, opacity: 0, transition: { duration: 0.8, ease: EASE_IN_OUT } }}>
        <span className={`mono ${styles.kicker}`}>Smart Sustainability Solutions</span>
        <h2 className={styles.word} aria-hidden="true">
          {WORD.split('').map((ch, i) => (
            <span key={i} className={styles.mask}>
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, ease: EASE_OUT, delay: 0.15 + i * 0.06 }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
        </h2>
        <div className={styles.foot}>
          <span className="mono">Measured in Qatar</span>
          <motion.span className={styles.pct}>{pct}</motion.span>
        </div>
        <div className={styles.track}>
          <motion.div className={styles.fill} style={{ scaleX }} />
        </div>
      </motion.div>
    </motion.div>
  );
}
