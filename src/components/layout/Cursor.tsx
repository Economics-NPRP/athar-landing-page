import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import styles from './Cursor.module.css';

type Mode = 'default' | 'hover' | 'drag' | 'hidden';

const INTERACTIVE = 'a, button, select, input, textarea, label, [role="button"]';
const finePointer = () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

/** Trailing ring that swells over links and turns into a "Drag" puck over the 3D canvases. Mouse only. */
export function Cursor() {
  const [enabled] = useState(finePointer);
  const [mode, setMode] = useState<Mode>('hidden');
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as Element | null;
      setMode(t?.closest('[data-cursor="drag"]') ? 'drag' : t?.closest(INTERACTIVE) ? 'hover' : 'default');
    };
    const leave = () => setMode('hidden');
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div className={styles.cursor} style={{ x: sx, y: sy }} aria-hidden="true">
      <motion.div
        className={styles.ring}
        data-mode={mode}
        animate={{
          scale: mode === 'drag' ? 2.4 : mode === 'hover' ? 1.7 : mode === 'hidden' ? 0 : 1,
          opacity: mode === 'hidden' ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      />
      <AnimatePresence>
        {mode === 'drag' && (
          <motion.span
            className={styles.label}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
          >
            Drag
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
