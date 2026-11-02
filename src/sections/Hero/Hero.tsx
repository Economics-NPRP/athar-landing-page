import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { HERO_STATS, VIDEO } from '../../content/site';
import { LazyDiorama } from '../../three/LazyDiorama';
import { supportsWebGL } from '../../three/supportsWebGL';
import { useInterval } from '../../hooks/useInterval';
import { Icon } from '../../components/ui/Icon';
import { Picture } from '../../components/ui/Picture';
import { ButtonLink } from '../../components/ui/ButtonLink';
import { SplitText } from '../../components/motion/SplitText';
import { Counter } from '../../components/motion/Counter';
import { Magnetic } from '../../components/motion/Magnetic';
import { EASE_OUT } from '../../components/motion/presets';
import styles from './Hero.module.css';

const enter = (delay: number) => ({
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE_OUT, delay } },
});

/** Full-height intro over the live 3D diorama, with floating readouts pinned to the model. */
export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const tagBuilding = useRef<HTMLDivElement>(null);
  const tagYard = useRef<HTMLDivElement>(null);
  const tagDc = useRef<HTMLDivElement>(null);
  const [webgl] = useState(supportsWebGL);
  const [live, setLive] = useState({ co2: 640, wbgt: '32.4' });

  useInterval(() => setLive({ co2: 632 + Math.round(Math.random() * 16), wbgt: (32.3 + Math.round(Math.random() * 2) / 10).toFixed(1) }), 3200);

  // Copy drifts up and fades as the hero scrolls away.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const labels = {
    refs: { building: tagBuilding, yard: tagYard, datacenter: tagDc },
    // Tags never sit under the headline on wide screens.
    minX: () => {
      const host = ref.current;
      const text = textRef.current;
      if (!host) return 0;
      if (host.clientWidth < 900 || !text) return host.clientWidth;
      return text.getBoundingClientRect().right - host.getBoundingClientRect().left + 16;
    },
  };

  const state = ready ? 'show' : 'hidden';

  return (
    <header id="top" ref={ref} className={styles.hero}>
      {webgl ? <LazyDiorama mode="hero" labels={labels} /> : <Picture src="/media/hero-scales" className={styles.fallback} />}
      <div className={styles.scrim} />
      <div className={styles.fade} />

      <div className={styles.tags} aria-hidden="true">
        <div ref={tagBuilding} className={styles.tag}>
          <div className={styles.tagBody} style={{ transform: 'translate(14px,-50%)' }}>
            <Icon name="st-good" solid size={10} color="var(--good)" />
            <span className={styles.tagMuted}>Administration building</span>
            <b className="num">{live.co2} ppm CO₂</b>
          </div>
        </div>
        <div ref={tagYard} className={styles.tag}>
          <div className={styles.tagBody} style={{ transform: 'translate(-20px,calc(-100% - 14px))' }}>
            <Icon name="st-crit" solid size={10} color="var(--crit)" />
            <b className="num">WBGT {live.wbgt} °C</b>
            <span className={styles.tagMuted}>Industrial yard · alert</span>
          </div>
        </div>
        <div ref={tagDc} className={styles.tag}>
          <div className={`${styles.tagBody} ${styles.tagAccent}`} style={{ transform: 'translate(-50%,calc(-100% - 16px))' }}>
            <Icon name="server" size={14} />
            <b>Sovereign AI data center</b>
            <span style={{ color: 'var(--accent-wash-2)' }}>hosted in Qatar</span>
          </div>
        </div>
      </div>

      <motion.div className={styles.content} style={{ y, opacity }} initial="hidden" animate={state}>
        <div ref={textRef} className={styles.copy}>
          <motion.span className={`mono ${styles.eyebrow}`} variants={enter(0.1)}>
            <motion.span className={styles.eyebrowLine} variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, ease: EASE_OUT } } }} />
            Measured every minute · Owned in Qatar
          </motion.span>
          <SplitText as="h1" className={styles.title} play={ready} delay={0.2} step={0.08}>
            Smart Sustainability <span className={styles.accent}>Solutions</span>
          </SplitText>
          <motion.p className={styles.lede} variants={enter(0.55)}>
            One platform for a villa, an administration building, industrial, educational and commercial institutions, a campus or compound, a
            whole city and the full country. Live air, heat and energy data become a monthly carbon footprint and a report at every scale, run
            from a sovereign AI data center in Qatar.
          </motion.p>
          <motion.div className={styles.actions} variants={enter(0.7)}>
            <Magnetic>
              <ButtonLink href="#contact" arrow>
                Request a briefing
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href="#walkthrough" variant="light">
                <Icon name="play" size={16} />
                Watch the walkthrough
                <span className={styles.duration}>{VIDEO.length}</span>
              </ButtonLink>
            </Magnetic>
          </motion.div>
        </div>

        <div className={styles.bottom}>
          <motion.dl className={styles.stats} variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.85 } } }}>
            {HERO_STATS.map(s => (
              <motion.div key={s.l} className={`${styles.stat} ${s.accent ? styles.statAccent : ''}`} variants={enter(0)}>
                <dt>{s.l}</dt>
                <dd>{ready ? <Counter value={s.v} /> : s.v}</dd>
              </motion.div>
            ))}
          </motion.dl>
          <motion.div className={styles.hint} variants={enter(1.1)}>
            <span className={styles.hintDrag}>
              <Icon name="hand" size={16} color="var(--mint)" />
              Drag to explore the model
            </span>
            <span className="mono">Simulated values · illustrative models</span>
          </motion.div>
        </div>
      </motion.div>
    </header>
  );
}
