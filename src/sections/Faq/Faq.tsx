import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FAQ } from '../../content/site';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Icon } from '../../components/ui/Icon';
import { EASE_OUT, fadeUp, stagger, VIEWPORT } from '../../components/motion/presets';
import styles from './Faq.module.css';

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="section" style={{ borderTop: '1px solid var(--line-soft)' }}>
      <div className={`container ${styles.layout}`}>
        <div className={styles.side}>
          <SectionHeader layout="stack" index="09" eyebrow="Questions" title="What people ask first" />
        </div>
        <motion.div className={styles.list} variants={stagger(0.06)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
          {FAQ.map(([q, a], i) => {
            const on = i === open;
            return (
              <motion.div key={q} className={styles.item} variants={fadeUp}>
                <button className={styles.q} aria-expanded={on} onClick={() => setOpen(on ? -1 : i)}>
                  {q}
                  <motion.span className={styles.toggle} animate={{ rotate: on ? 45 : 0 }} transition={{ duration: 0.35, ease: EASE_OUT }}>
                    <Icon name="plus" size={18} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      className={styles.a}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE_OUT }}
                    >
                      <p>{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
