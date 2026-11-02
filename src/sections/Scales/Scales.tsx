import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SCALES } from '../../content/site';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Icon } from '../../components/ui/Icon';
import { LazyDiorama } from '../../three/LazyDiorama';
import { supportsWebGL } from '../../three/supportsWebGL';
import { clipUp, EASE_OUT, fadeUp, stagger, VIEWPORT } from '../../components/motion/presets';
import styles from './Scales.module.css';

const ALL = { n: '01–09', t: 'Every scale', place: 'Qatar · one platform, every site' };

/** Accordion of the nine scales; opening one flies the 3D camera to that model. */
export function Scales() {
  const [active, setActive] = useState<string>('villa');
  const [webgl] = useState(supportsWebGL);
  const sel = SCALES.find(s => s.id === active) ?? ALL;

  return (
    <section id="scales" className="section section--ground">
      <div className="container">
        <SectionHeader
          index="02"
          eyebrow="Every scale"
          title="One platform, from a villa to the whole country"
          lede="The same calibrated sensors, data model, dashboards and reports work for every kind of site. Start with one building and connect the rest when you are ready."
        />
        <div className={styles.layout}>
          <motion.div className={styles.stage} variants={clipUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
            {webgl ? <LazyDiorama mode="explore" focus={active} /> : <img src="/media/hero-scales.jpg" alt="" className={styles.fallback} />}
            <div className={styles.badges}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={sel.t}
                  className={styles.badgeStack}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                >
                  <span className={`mono ${styles.badge}`}>
                    {sel.n} · {sel.t}
                  </span>
                  <span className="tag-dark">{sel.place}</span>
                </motion.div>
              </AnimatePresence>
            </div>
            <button className={styles.allBtn} onClick={() => setActive('all')}>
              <Icon name="zoomout" size={16} />
              All scales
            </button>
            <div className={styles.foot}>
              <span className={`tag-dark ${styles.drag}`}>
                <Icon name="hand" size={16} color="var(--mint)" />
                Drag to rotate
              </span>
              <span className={`mono tag-dark ${styles.sim}`}>Simulated values · illustrative models</span>
            </div>
          </motion.div>

          <motion.ol className={styles.list} variants={stagger(0.05, 0.2)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
            {SCALES.map(s => {
              const on = s.id === active;
              return (
                <motion.li key={s.id} className={styles.item} variants={fadeUp}>
                  <button className={`${styles.row} ${on ? styles.rowOn : ''}`} aria-expanded={on} onClick={() => setActive(on ? 'all' : s.id)}>
                    <span className={styles.n}>{s.n}</span>
                    <span className={styles.name}>{s.t}</span>
                    <motion.span animate={{ rotate: on ? 45 : 0 }} transition={{ duration: 0.3, ease: EASE_OUT }} className={styles.plus}>
                      <Icon name="plus" size={16} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        className={styles.panelWrap}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE_OUT }}
                      >
                        <div className={styles.panel}>
                          <p>{s.p}</p>
                          <dl className={styles.facts}>
                            <dt className="mono">{s.ai ? 'Runs' : 'Measures'}</dt>
                            <dd>{s.m}</dd>
                            <dt className="mono">{s.ai ? 'Principles' : 'Delivers'}</dt>
                            <dd>{s.g}</dd>
                          </dl>
                          {s.ai && (
                            <a href="#aidc" className={styles.more}>
                              Inside the AI data center
                              <Icon name="arrow" />
                            </a>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
