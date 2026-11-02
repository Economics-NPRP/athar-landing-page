import { motion } from 'motion/react';
import { STATS } from '../../content/site';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Icon } from '../../components/ui/Icon';
import { Counter } from '../../components/motion/Counter';
import { Reveal } from '../../components/motion/Reveal';
import { EASE_OUT, fadeUp, stagger, VIEWPORT } from '../../components/motion/presets';
import styles from './Why.module.css';

export function Why() {
  return (
    <section id="why" className="section">
      <div className="container">
        <SectionHeader
          index="01"
          eyebrow="Why now"
          title="Buildings run 24/7. Their audits don't."
          lede="Qatar's climate commitments need measured evidence at every scale, from a single home to the national inventory. Design ratings and annual estimates cannot show which building, site or district is drifting, why, or whether a fix worked."
        />

        <motion.div className={styles.stats} variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
          {STATS.map(s => (
            <motion.div key={s.l} className={styles.stat} variants={fadeUp}>
              <p className={styles.value}>
                <Counter value={s.v} className={styles.big} />
                {s.u && <span className={styles.unit}>{s.u}</span>}
              </p>
              <p className={styles.label}>{s.l}</p>
              {s.href ? (
                <a href={s.href} target="_blank" rel="noreferrer" className={styles.src}>
                  {s.src}
                </a>
              ) : (
                <span className={styles.src}>{s.src}</span>
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className={styles.gaps}>
          <Reveal className={styles.gap}>
            <h3 className={styles.gapTitle}>
              <Icon name="gauge" color="var(--accent)" />
              The performance gap
            </h3>
            <p className={styles.gapText}>
              Ratings rest on periodic audits and modelled estimates. Real performance drifts with seasons, occupancy and wear, so certified
              figures and operating reality quietly diverge.
            </p>
            <AuditTimeline />
          </Reveal>
          <Reveal className={styles.gap}>
            <h3 className={styles.gapTitle}>
              <Icon name="flag" color="var(--accent)" />
              The sovereignty gap
            </h3>
            <p className={styles.gapText} style={{ maxWidth: '56ch' }}>
              The data that does exist is fragmented across vendors and often processed and held abroad. The evidence base for national policy
              is neither continuous nor owned in Qatar.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Three audit squares vs. a dense measurement barcode that sweeps in. */
function AuditTimeline() {
  return (
    <motion.div className={styles.timeline} initial="hidden" whileInView="show" viewport={VIEWPORT}>
      <div className={styles.row}>
        <span className={`mono ${styles.rowLabel}`}>Periodic audits</span>
        <div className={styles.track} style={{ marginTop: 14 }}>
          <motion.div className={styles.axis} variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.2, ease: EASE_OUT } } }} />
          {(['0%', '50%', '100%'] as const).map((left, i) => (
            <motion.span
              key={left}
              className={styles.audit}
              style={{ left, marginLeft: i === 0 ? 0 : i === 1 ? -6 : -13 }}
              variants={{ hidden: { scale: 0 }, show: { scale: 1, transition: { type: 'spring', stiffness: 300, damping: 16, delay: 0.3 + i * 0.25 } } }}
            />
          ))}
          <span className={styles.tick} style={{ left: 0 }}>Year 1</span>
          <span className={styles.tick} style={{ left: '50%', transform: 'translateX(-50%)' }}>Year 3</span>
          <span className={styles.tick} style={{ right: 0 }}>Year 5</span>
          <span className={styles.note}>nothing recorded in between</span>
        </div>
      </div>
      <div className={styles.row}>
        <span className={`mono ${styles.rowLabel}`}>Continuous measurement</span>
        <div className={styles.track}>
          <motion.div
            className={styles.barcode}
            variants={{ hidden: { clipPath: 'inset(0 100% 0 0)' }, show: { clipPath: 'inset(0 0% 0 0)', transition: { duration: 1.8, ease: EASE_OUT, delay: 0.4 } } }}
          />
          <span className={styles.note} style={{ top: 28, left: 0, right: 0 }}>
            every minute, at every scale
          </span>
        </div>
      </div>
    </motion.div>
  );
}
