import { useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { DASHBOARD_URL, NAV_ITEMS } from '../../content/site';
import { Icon } from '../ui/Icon';
import { ButtonLink } from '../ui/ButtonLink';
import { EASE_OUT } from '../motion/presets';
import styles from './Nav.module.css';

/** Fixed pine bar. Slides away while scrolling down, returns on the way up. */
export function Nav({ show }: { show: boolean }) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', y => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 400 && y > prev && !open);
  });

  const close = () => setOpen(false);

  return (
    <motion.div
      className={styles.bar}
      initial={{ y: '-100%' }}
      animate={{ y: show && !hidden ? '0%' : '-100%' }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
    >
      <nav className={styles.nav} aria-label="Main">
        <a href="#top" className={styles.brand}>
          <img src="/media/ecodesign-logo-light.webp" alt="EcoDesign" className={styles.logo} />
          <span className={styles.wordmark}>Athar</span>
        </a>
        <div className={styles.links}>
          {NAV_ITEMS.map(n => (
            <a key={n.href} href={n.href} className={styles.link}>
              <span>{n.label}</span>
            </a>
          ))}
        </div>
        <div className={styles.cta}>
          <ButtonLink href={DASHBOARD_URL} size="sm" arrow>
            <span className={styles.ctaLong}>Go to dashboard</span>
            <span className={styles.ctaShort}>Dashboard</span>
          </ButtonLink>
        </div>
        <button className={styles.menuBtn} onClick={() => setOpen(o => !o)} aria-label="Menu" aria-expanded={open}>
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.sheet}
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <motion.ul initial="hidden" animate="show" exit="hidden" variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}>
              {NAV_ITEMS.map(n => (
                <motion.li key={n.href} variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}>
                  <a href={n.href} onClick={close} className={styles.sheetLink}>
                    {n.label}
                    <Icon name="chev" color="var(--on-pine-3)" />
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
