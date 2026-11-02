import { useState } from 'react';
import { motion } from 'motion/react';
import { AI, AI_CHIPS } from '../../content/site';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Icon } from '../../components/ui/Icon';
import { LazyDiorama } from '../../three/LazyDiorama';
import { supportsWebGL } from '../../three/supportsWebGL';
import { clipUp, fadeUp, stagger, VIEWPORT } from '../../components/motion/presets';
import styles from './AiDataCenter.module.css';

export function AiDataCenter() {
  const [webgl] = useState(supportsWebGL);
  return (
    <section id="aidc" className="section section--pine on-dark">
      <div className="container">
        <SectionHeader
          index="06"
          eyebrow="Sovereign AI data center"
          title="Then, a sovereign AI data center for sustainability"
          lede="Every reading from every scale lands in one data center in Qatar. There, AI models calibrate sensors, find faults, forecast heat and verify carbon, on infrastructure the data owners control."
        />
        <motion.figure className={styles.stage} variants={clipUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
          {webgl && <LazyDiorama mode="dc" />}
          <figcaption className={`mono ${styles.caption}`}>Illustrative concept</figcaption>
        </motion.figure>
        <motion.ul className={styles.grid} variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
          {AI.map(a => (
            <motion.li key={a.t} className={styles.item} variants={fadeUp}>
              <span className={styles.icon}>
                <Icon name={a.icon} size={20} />
              </span>
              <h3>{a.t}</h3>
              <p>{a.p}</p>
            </motion.li>
          ))}
        </motion.ul>
        <motion.div className="chips" style={{ marginTop: 36 }} variants={stagger(0.06)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
          {AI_CHIPS.map(c => (
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
