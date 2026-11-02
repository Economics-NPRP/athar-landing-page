import { motion } from 'motion/react';
import { PRINCIPLES, STANDARDS } from '../../content/site';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Icon } from '../../components/ui/Icon';
import { fadeUp, stagger, VIEWPORT } from '../../components/motion/presets';
import styles from './Trust.module.css';

/** Sticky sovereignty statement beside the six data principles. */
export function Trust() {
  return (
    <section id="trust" className="section section--ground">
      <div className={`container ${styles.layout}`}>
        <div className={styles.side}>
          <SectionHeader
            layout="stack"
            index="07"
            eyebrow="Sovereign by design"
            title="Your data stays yours. Qatar hosts it."
            lede="Sustainability data describes homes, institutions and national infrastructure. It should be measured in Qatar, stored in Qatar and controlled by whoever generates it: a family, an institution, a city or the state."
          >
            <motion.div variants={fadeUp}>
              <p className={`mono ${styles.aligned}`}>Aligned with</p>
              <div className={styles.standards}>
                {STANDARDS.map(s => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </motion.div>
          </SectionHeader>
        </div>
        <motion.ul className={styles.grid} variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
          {PRINCIPLES.map(p => (
            <motion.li key={p.t} className={`card ${styles.card}`} variants={fadeUp}>
              <Icon name={p.icon} size={26} color="var(--accent)" />
              <h3>{p.t}</h3>
              <p>{p.p}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
