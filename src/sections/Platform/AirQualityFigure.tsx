import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { jitter, legend, nf, SEGS, STATUS_COLOR, STATUS_ICON, status, unitText, type SegId } from '../../content/platform';
import { useInterval } from '../../hooks/useInterval';
import { useDohaClock } from '../../hooks/useDohaClock';
import { Icon } from '../../components/ui/Icon';
import { Sparkline } from '../../components/charts/Sparkline';
import styles from './Platform.module.css';

const BANDS = ['good', 'warn', 'crit'] as const;

/** Live tile grid; values jitter every few seconds and roll in when they change. */
export function AirQualityFigure({ seg }: { seg: SegId }) {
  const cfg = SEGS[seg];
  const clock = useDohaClock();
  const [live, setLive] = useState<{ seg: SegId; v: number[] } | null>(null);
  useInterval(() => setLive({ seg, v: jitter(seg) }), 3200);
  const vals = live?.seg === seg ? live.v : cfg.zones.map(z => z[1]);

  return (
    <figure className={`figure-card ${styles.figure}`}>
      <div className={styles.figHead}>
        <div>
          <p className={styles.figTitle}>{cfg.iaq}</p>
          <p className={styles.figSub}>updated {clock} · every minute · simulated values</p>
        </div>
        <span className={`mono ${styles.live}`}>
          <span className={styles.liveDot} />
          Live
        </span>
      </div>
      <div className={styles.tiles}>
        {cfg.zones.map(([name], i) => {
          const st = status(seg, vals[i]);
          return (
            <motion.div key={`${seg}-${name}`} className={styles.tile} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}>
              <span className={styles.tileName}>
                <Icon name={STATUS_ICON[st]} solid size={10} color={STATUS_COLOR[st]} />
                <span>{name}</span>
              </span>
              <span className={styles.tileValue}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span key={vals[i]} initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={{ duration: 0.4 }}>
                    {nf.format(vals[i])}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className={styles.tileUnit}>{unitText(seg)}</span>
            </motion.div>
          );
        })}
      </div>
      <div className={styles.figFoot}>
        <div className={styles.sparkRow}>
          <span>
            {cfg.zones[cfg.spark][0]} · {cfg.metric === 'pm' ? 'PM2.5' : 'CO₂'} today
          </span>
          <Sparkline seg={seg} current={vals[cfg.spark]} />
        </div>
        <ul className={styles.legend}>
          {legend(seg).map((t, i) => (
            <li key={t}>
              <Icon name={STATUS_ICON[BANDS[i]]} solid size={10} color={STATUS_COLOR[BANDS[i]]} />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
