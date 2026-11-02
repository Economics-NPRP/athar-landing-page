import { SCALES } from '../../content/site';
import { Marquee } from '../../components/motion/Marquee';
import styles from './Ticker.module.css';

/** Scroll-reactive band of every scale between the hero and the first section. */
export function Ticker() {
  return (
    <Marquee className={styles.band} speed={3}>
      {SCALES.map(s => (
        <span key={s.id} className={styles.item}>
          <span className={styles.n}>{s.n}</span>
          {s.t}
          <span className={styles.dot} />
        </span>
      ))}
    </Marquee>
  );
}
