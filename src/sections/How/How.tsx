import { motion } from 'motion/react';
import { HOW, HOW_CHIPS } from '../../content/site';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Icon } from '../../components/ui/Icon';
import { EASE_OUT, fadeUp, stagger, VIEWPORT } from '../../components/motion/presets';
import styles from './How.module.css';

const row = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

/** The five-step evidence chain, revealed as a stepped list. */
export function How() {
  return (
    <section id="how" className="section">
      <div className="container">
        <SectionHeader
          index="04"
          eyebrow="How it works"
          title="From sensor to report, in one chain the data owner controls"
          lede="Sensing, network, platform and reports work as one evidence chain at every scale, so every figure in a report traces back to a calibrated reading or a meter record."
        />
        <motion.ol className={styles.list} variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
          {HOW.map(h => (
            <motion.li key={h.n} className={styles.row} variants={row}>
              <div className={styles.head}>
                <span className={`mono ${styles.n}`}>{h.n}</span>
                <span className={styles.icon}>
                  <Icon name={h.icon} size={24} />
                </span>
                <h3 className={styles.title}>{h.t}</h3>
              </div>
              <p className={styles.text}>{h.p}</p>
            </motion.li>
          ))}
        </motion.ol>
        <motion.div className="chips" style={{ marginTop: 28 }} variants={stagger(0.06)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
          {HOW_CHIPS.map(c => (
            <motion.span key={c.t} className="chip" variants={fadeUp}>
              <Icon name={c.icon} />
              {c.t}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
