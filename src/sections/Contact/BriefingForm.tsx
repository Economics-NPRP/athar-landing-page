import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CONTACT_EMAIL, INTERESTS, SITE_TYPES } from '../../content/site';
import { Icon } from '../../components/ui/Icon';
import { EASE_OUT } from '../../components/motion/presets';
import { validateBriefing, type BriefingFields, type BriefingErrors } from './briefing';
import styles from './Contact.module.css';

const EMPTY: BriefingFields = { name: '', org: '', email: '', site: SITE_TYPES[0], interest: INTERESTS[0], msg: '' };

type Status = { state: 'idle' | 'sending' | 'sent' | 'failed'; message?: string };

/** Validates in the browser, then the server re-validates and emails the request to the SMARTSS inbox. */
export function BriefingForm() {
  const [f, setF] = useState(EMPTY);
  const [website, setWebsite] = useState(''); // honeypot, see server/index.ts
  const [errs, setErrs] = useState<BriefingErrors>({});
  const [status, setStatus] = useState<Status>({ state: 'idle' });

  const field = (k: keyof BriefingFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const v = e.target.value;
    setF(s => ({ ...s, [k]: v }));
    setErrs(s => ({ ...s, [k]: undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status.state === 'sending') return;
    const found = validateBriefing(f);
    setErrs(found);
    if (Object.keys(found).length) return;

    setStatus({ state: 'sending' });
    try {
      const res = await fetch('/api/briefing', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, website }) });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus({ state: 'sent' });
        setF(EMPTY);
      } else if (res.status === 422 && data.errors) {
        setErrs(data.errors);
        setStatus({ state: 'idle' });
      } else {
        setStatus({ state: 'failed', message: data.error ?? 'The message could not be sent.' });
      }
    } catch {
      setStatus({ state: 'failed', message: 'You appear to be offline.' });
    }
  };

  return (
    <form className={`figure-card ${styles.form}`} onSubmit={submit} noValidate>
      <p className={styles.formTitle}>Request a briefing</p>
      <div className={styles.pair}>
        <Field label="Full name" error={errs.name}>
          <input value={f.name} onChange={field('name')} autoComplete="name" aria-invalid={!!errs.name} />
        </Field>
        <Field label="Organization">
          <input value={f.org} onChange={field('org')} autoComplete="organization" />
        </Field>
      </div>
      <Field label="Work email" error={errs.email}>
        <input type="email" value={f.email} onChange={field('email')} autoComplete="email" aria-invalid={!!errs.email} />
      </Field>
      <div className={styles.pair}>
        <Field label="Type of site">
          <select value={f.site} onChange={field('site')}>
            {SITE_TYPES.map(t => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="I'm interested in">
          <select value={f.interest} onChange={field('interest')}>
            {INTERESTS.map(t => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Message" error={errs.msg}>
        <textarea value={f.msg} onChange={field('msg')} placeholder="Tell us about your site and what you want to measure." aria-invalid={!!errs.msg} />
      </Field>
      <input
        className="visually-hidden"
        name="website"
        value={website}
        onChange={e => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div className={styles.submitRow}>
        <button type="submit" className="btn btn--mint" disabled={status.state === 'sending'}>
          <Icon name="mail" />
          {status.state === 'sending' ? 'Sending…' : 'Send request'}
        </button>
        <span className={styles.hint}>Your request goes straight to our team at {CONTACT_EMAIL}. We reply to the email address you enter.</span>
      </div>
      <AnimatePresence>
        {(status.state === 'sent' || status.state === 'failed') && (
          <motion.div
            key={status.state}
            className={styles.result}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <div className={`${styles.resultInner} ${status.state === 'failed' ? styles.resultFailed : ''}`} role="status">
              {status.state === 'sent' ? (
                <>
                  <p className={styles.resultTitle}>Thank you, your request is on its way</p>
                  <p>Our team will reply to you by email.</p>
                </>
              ) : (
                <>
                  <p className={styles.resultTitle}>Your request was not sent</p>
                  <p>
                    {status.message} Try again in a moment, or email us directly at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className={styles.field}>
      {label}
      {children}
      <AnimatePresence>
        {error && (
          <motion.span className={styles.error} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}
