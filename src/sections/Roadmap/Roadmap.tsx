import { motion } from 'motion/react';
import { LEVELS } from '../../content/site';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Icon } from '../../components/ui/Icon';
import { Reveal } from '../../components/motion/Reveal';
import { EASE_OUT, stagger, VIEWPORT } from '../../components/motion/presets';
import styles from './Roadmap.module.css';

const step = {
  hidden: { opacity: 0, y: 80 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE_OUT } },
};

/** Six levels laid out as a rising staircase on wide screens. */
export function Roadmap() {
  return (
    <section id="roadmap" className="section">
      <div className="container">
        <SectionHeader
          index="08"
          eyebrow="Roadmap"
          title="From one villa to the whole country, then a sovereign AI data center"
          lede="The same sensors, platform and reporting method repeat at every scale. Each step builds on measured results from the one before, and every level reports to one data center in Qatar."
        />
        <motion.ol className={styles.steps} variants={stagger(0.12)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
          {LEVELS.map((l, i) => (
            <motion.li key={l.n} className={`${styles.step} ${l.ai ? styles.ai : ''}`} style={{ '--rise': 5 - i } as React.CSSProperties} variants={step}>
              <div className={styles.top}>
                <span className={styles.icon}>
                  <Icon name={l.icon} size={24} />
                </span>
                <span className={styles.k}>0{i + 1}</span>
              </div>
              <div className={styles.body}>
                <span className={`mono ${styles.level}`}>{l.n}</span>
                <h3>{l.t}</h3>
                <p>{l.p}</p>
                <span className={styles.unit}>{l.u}</span>
              </div>
            </motion.li>
          ))}
        </motion.ol>
        <Reveal className={styles.banner} y={20}>
          <Icon name="server" size={20} />
          Sovereign AI data center for sustainability · hosted in Qatar
        </Reveal>
      </div>
    </section>
  );
}
