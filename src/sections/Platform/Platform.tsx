import { useState } from 'react';
import { motion } from 'motion/react';
import { SEG_ORDER, SEG_SHORT, SEGS, type SegId } from '../../content/platform';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Reveal } from '../../components/motion/Reveal';
import { EASE_OUT, fadeUp, stagger, VIEWPORT } from '../../components/motion/presets';
import { AirQualityFigure } from './AirQualityFigure';
import { CarbonFigure } from './CarbonFigure';
import { ReportFigure } from './ReportFigure';
import { SensorCards } from './SensorCards';
import styles from './Platform.module.css';

type Feature = { kicker: string; title: string; text: string; facts: [string, string][] };

const FEATURES: Feature[] = [
  {
    kicker: 'Air quality · live',
    title: 'Air quality, every minute',
    text: 'Every room, zone or district streams CO₂, particulates, VOC, temperature and humidity to dashboards, lobby displays and an open data feed, in under two minutes from sensor to screen. When a reading stays above its threshold, the right person gets an alert.',
    facts: [['9', 'live zones on this screen'], ['<2 min', 'from sensor to screen'], ['3', 'status bands, with alerts']],
  },
  {
    kicker: 'Carbon layer · monthly',
    title: 'A measured carbon footprint, every month',
    text: 'The platform turns metered electricity, chilled water and fuel, with documented emission factors, into a Scope 1 and 2 footprint every month for a home, a building, a site, a city or the country, with intensity per square metre and a weather-normalised baseline. Annual inventories follow the GHG Protocol and ISO 14064-1, ready for third-party verification.',
    facts: [['Monthly', 'Scope 1 and 2 at every scale'], ['kgCO₂e/m²', 'intensity, to compare sites'], ['ISO 14064-1', 'annual inventory']],
  },
  {
    kicker: 'Reporting',
    title: 'A sustainability report at every scale',
    text: 'A villa gets a monthly carbon statement, a building or site a quarterly report, and an institution, a city or the country a roll-up for leadership and disclosure. Every figure is traceable to calibrated readings or meter records.',
    facts: [['Live', 'dashboard for every site'], ['Quarterly', 'site and building reports'], ['Annual', 'report and roll-ups']],
  },
];

/** Three dashboards driven by one sticky scale switch, plus the sensor families. */
export function Platform() {
  const [seg, setSeg] = useState<SegId>('villa');
  const figures = [<AirQualityFigure seg={seg} />, <CarbonFigure seg={seg} />, <ReportFigure seg={seg} />];

  return (
    <section id="platform" className="section section--ground">
      <div className="container">
        <SectionHeader
          index="05"
          eyebrow="The platform"
          title="What every site gets, at every scale"
          lede="Live air, gas and heat monitoring, a monthly carbon footprint and a sustainability report. Pick a scale to see the same dashboards adapt to it."
        />

        <div className={styles.switchBar}>
          <div className={styles.switchRow}>
            <div role="group" aria-label="Choose a scale for the dashboards" className={styles.segs}>
              {SEG_ORDER.map(k => (
                <button key={k} className={styles.seg} aria-pressed={k === seg} onClick={() => setSeg(k)}>
                  {k === seg && <motion.span layoutId="seg-pill" className={styles.pill} transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                  <span className={styles.segLabel}>{SEG_SHORT[k]}</span>
                </button>
              ))}
            </div>
            <span className={styles.showing}>Showing: {SEGS[seg].name}</span>
          </div>
        </div>

        {FEATURES.map((f, i) => (
          <article key={f.kicker} className={`${styles.feature} ${i % 2 ? styles.reverse : ''}`}>
            <motion.div className={styles.copy} variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
              <motion.span className={`mono ${styles.kicker}`} variants={fadeUp}>
                {f.kicker}
              </motion.span>
              <motion.h3 className="h3" variants={fadeUp}>
                {f.title}
              </motion.h3>
              <motion.p className={styles.text} variants={fadeUp}>
                {f.text}
              </motion.p>
              <motion.ul className={styles.facts} variants={fadeUp}>
                {f.facts.map(([b, s]) => (
                  <li key={b}>
                    <b>{b}</b>
                    <span>{s}</span>
                  </li>
                ))}
              </motion.ul>
            </motion.div>
            <motion.div
              className={styles.figureCol}
              initial={{ opacity: 0, y: 60, rotate: i % 2 ? -1.5 : 1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 1.1, ease: EASE_OUT }}
            >
              {figures[i]}
            </motion.div>
          </article>
        ))}

        <Reveal>
          <SensorCards />
        </Reveal>
      </div>
    </section>
  );
}
