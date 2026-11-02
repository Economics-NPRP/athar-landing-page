import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CHAPTERS, VIDEO } from '../../content/site';
import { useYouTubePlayer } from '../../hooks/useYouTubePlayer';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Icon } from '../../components/ui/Icon';
import { Picture } from '../../components/ui/Picture';
import { CLIP_VIEWPORT, clipUp, EASE_OUT, fadeUp, stagger, VIEWPORT } from '../../components/motion/presets';
import styles from './Walkthrough.module.css';

/** Walkthrough on YouTube behind a custom thumbnail, with a chapter rail that seeks and follows playback. */
export function Walkthrough() {
  const host = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [chap, setChap] = useState(0);
  const [prog, setProg] = useState(0);
  const now = CHAPTERS[chap];

  const onTime = (t: number, duration: number) => {
    const i = Math.max(0, CHAPTERS.findLastIndex(c => t >= c.t));
    const end = CHAPTERS[i + 1]?.t ?? (duration || CHAPTERS[i].t + 20);
    const p = Math.max(0, Math.min(1, (t - CHAPTERS[i].t) / (end - CHAPTERS[i].t)));
    setChap(i);
    setProg(prev => (Math.abs(p - prev) > 0.01 ? p : prev));
  };

  const { seek } = useYouTubePlayer({ host, videoId: VIDEO.youtubeId, active: playing, start: now.t, onTime });

  const go = (i: number) => {
    setChap(i);
    setProg(0);
    if (playing) seek(CHAPTERS[i].t);
    else setPlaying(true);
  };

  return (
    <section id="walkthrough" className="section section--deep on-dark">
      <div className="container">
        <SectionHeader
          index="03"
          eyebrow="Walkthrough · 2 min 28 s"
          title="See every scale, chapter by chapter"
          lede="Fourteen short chapters move from a single villa to the whole country and the sovereign AI data center behind it. Pick a chapter to jump straight to it."
        />
        <div className={styles.layout}>
          <motion.div className={styles.player} variants={clipUp} initial="hidden" whileInView="show" viewport={CLIP_VIEWPORT}>
            <div ref={host} className={styles.embed} />
            <AnimatePresence>
              {!playing && (
                <motion.button
                  key="thumbnail"
                  className={styles.thumbnail}
                  onClick={() => setPlaying(true)}
                  aria-label={`Play the walkthrough from chapter ${now.n}: ${now.title}`}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.6, ease: EASE_OUT }}
                >
                  <Picture src={chap === 0 ? VIDEO.poster : now.img} className={styles.thumbImg} />
                  <span className={styles.thumbScrim} />
                  <span className={`mono ${styles.thumbChip}`}>
                    <Icon name="play" size={10} />
                    Walkthrough · {VIDEO.length}
                  </span>
                  <span className={styles.thumbCaption}>
                    <span className={styles.playBtn}>
                      <span className={styles.playRing} />
                      <Icon name="play" size={28} />
                    </span>
                    <span className={styles.thumbText}>
                      <span className={`mono ${styles.thumbKicker}`}>Chapter {now.n}</span>
                      <span className={styles.thumbTitle}>{now.title}</span>
                    </span>
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
          <div className={styles.info}>
            <AnimatePresence mode="wait">
              <motion.div
                key={chap}
                className={styles.infoBody}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
              >
                <span className={`mono ${styles.kicker}`}>
                  Chapter {now.n} / {CHAPTERS.length} · {now.grp}
                </span>
                <h3 className={styles.title}>{now.title}</h3>
                <p className={styles.sum}>{now.sum}</p>
              </motion.div>
            </AnimatePresence>
            <div className={styles.progress}>
              <motion.div className={styles.progressFill} animate={{ scaleX: prog }} transition={{ duration: 0.25, ease: 'linear' }} />
            </div>
            <p className={styles.note}>Simulated values on illustrative models. On-screen text in the video is in English.</p>
          </div>
        </div>
        <motion.ol className={styles.rail} variants={stagger(0.04)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
          {CHAPTERS.map((c, i) => (
            <motion.li key={c.n} variants={fadeUp}>
              <button className={`${styles.chapter} ${i === chap ? styles.chapterOn : ''}`} onClick={() => go(i)} aria-current={i === chap}>
                <span className={styles.thumb}>
                  <Picture src={c.img} loading="lazy" />
                </span>
                <span className={`mono ${styles.meta}`}>
                  <span className={styles.metaN}>{c.n}</span>
                  <span>{c.grp}</span>
                </span>
                <span className={styles.chapterTitle}>{c.title}</span>
              </button>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
