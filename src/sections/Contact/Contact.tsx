import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AUDIENCE_WORDS, CONTACT_EMAIL, DASHBOARD_URL } from '../../content/site';
import { useInterval } from '../../hooks/useInterval';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Icon } from '../../components/ui/Icon';
import { ButtonLink } from '../../components/ui/ButtonLink';
import { Reveal } from '../../components/motion/Reveal';
import { Magnetic } from '../../components/motion/Magnetic';
import { EASE_OUT } from '../../components/motion/presets';
import { BriefingForm } from './BriefingForm';
import { useCopy } from './useCopy';
import styles from './Contact.module.css';

/** Rotating audience word: slides up out of a mask every two seconds. */
function AudienceWord() {
  const [i, setI] = useState(0);
  useInterval(() => setI(n => (n + 1) % AUDIENCE_WORDS.length), 2000);
  return (
    <span className={styles.wordMask}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={AUDIENCE_WORDS[i]}
          className={styles.word}
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          {AUDIENCE_WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Contact() {
  const [copied, copy] = useCopy();

  return (
    <section id="contact" className="section section--ground" style={{ borderBottom: 0 }}>
      <div className={`container ${styles.layout}`}>
        <div className={styles.side}>
          <SectionHeader layout="stack" index="10" eyebrow="Work with us" title="Bring measured sustainability to your">
            {/* Decorative: the heading above already reads as a complete invitation. */}
            <div className={`h2 ${styles.rotator}`} aria-hidden="true">
              <AudienceWord />
            </div>
          </SectionHeader>
          <Reveal>
            <p className={styles.lede}>
              We invite homeowners, institutions, developers and authorities in Qatar to become founding partners: host a pilot, join the
              research, or ask for a briefing for your leadership.
            </p>
          </Reveal>
          <Reveal className={`card ${styles.details}`} delay={0.1}>
            <span>
              <Icon name="pin" size={18} color="var(--accent)" />
              Qatar Science &amp; Technology Park, Doha
            </span>
            <span>
              <Icon name="mail" size={18} color="var(--accent)" />
              <b>{CONTACT_EMAIL}</b>
              <button className={styles.copy} onClick={() => copy(CONTACT_EMAIL, 'email')}>
                <Icon name="copy" />
                {copied === 'email' ? 'Copied' : copied === 'email-fail' ? 'Select the text and copy it' : 'Copy'}
              </button>
            </span>
            <span>
              <Icon name="phone" size={18} color="var(--accent)" />
              <b>+974 7401 5848</b>
            </span>
          </Reveal>
        </div>

        <Reveal className={styles.formCol} delay={0.15} y={48}>
          <BriefingForm />
        </Reveal>

        <Reveal className={styles.signin}>
          <div>
            <p className={styles.signinTitle}>Already working with us?</p>
            <p className={styles.signinText}>Sign in to the sustainability reporting dashboard.</p>
          </div>
          <Magnetic>
            <ButtonLink href={DASHBOARD_URL} size="sm" arrow>
              Go to dashboard
            </ButtonLink>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
