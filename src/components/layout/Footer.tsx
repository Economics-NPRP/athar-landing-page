import { motion } from 'motion/react';
import { DASHBOARD_URL } from '../../content/site';
import { EASE_OUT } from '../motion/presets';
import styles from './Footer.module.css';

const LINKS = [
  { href: DASHBOARD_URL, label: 'Dashboard' },
  { href: 'https://ecodesign.global/', label: 'EcoDesign', external: true },
  { href: '#contact', label: 'Contact' },
  { href: '#top', label: 'Back to top' },
];

/** Closing band with an oversized wordmark that rises letter by letter. */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.about}>
            <img src="/media/ecodesign-logo-light.webp" alt="EcoDesign" className={styles.logo} />
            <p>Smart Sustainability Solutions is developed by EcoDesign.global at Qatar Science &amp; Technology Park, Doha.</p>
          </div>
          <ul className={styles.links}>
            {LINKS.map(l => (
              <li key={l.label}>
                <a href={l.href} {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <motion.p className={styles.wordmark} aria-hidden="true" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
          {'SMARTSS'.split('').map((ch, i) => (
            <span key={i} className={styles.mask}>
              <motion.span
                variants={{ hidden: { y: '100%' }, show: { y: '0%', transition: { duration: 1.1, ease: EASE_OUT, delay: i * 0.07 } } }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
        </motion.p>
        <div className={styles.bottom}>
          <span>Figures in the dashboards, charts and walkthrough are simulated values on illustrative models.</span>
          <span>© 2026 EcoDesign.global</span>
        </div>
      </div>
    </footer>
  );
}
