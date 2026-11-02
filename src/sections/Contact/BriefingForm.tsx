import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CONTACT_EMAIL, INTERESTS, SITE_TYPES } from '../../content/site';
import { Icon } from '../../components/ui/Icon';
import { EASE_OUT } from '../../components/motion/presets';
import { buildBriefingEmail, validateBriefing, type BriefingFields, type BriefingErrors } from './briefing';
import { useCopy } from './useCopy';
import styles from './Contact.module.css';

const EMPTY: BriefingFields = { name: '', org: '', email: '', site: SITE_TYPES[0], interest: INTERESTS[0], msg: '' };

/** No backend: validates, then prepares a mailto link plus a copyable plain-text fallback. */
export function BriefingForm() {
  const [f, setF] = useState(EMPTY);
  const [errs, setErrs] = useState<BriefingErrors>({});
  const [result, setResult] = useState<ReturnType<typeof buildBriefingEmail> | null>(null);
  const [copied, copy] = useCopy();

  const field = (k: keyof BriefingFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const v = e.target.value;
    setF(s => ({ ...s, [k]: v }));
    setErrs(s => ({ ...s, [k]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = validateBriefing(f);
    setErrs(found);
    setResult(Object.keys(found).length ? null : buildBriefingEmail(f));
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
      <div className={styles.submitRow}>
        <button type="submit" className="btn btn--mint">
          <Icon name="mail" />
          Prepare email
        </button>
        <span className={styles.hint}>
          This form does not send anything itself. It prepares an email to {CONTACT_EMAIL} that you send from your own mail app.
        </span>
      </div>
      <AnimatePresence>
        {result && (
          <motion.div
            className={styles.result}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <div className={styles.resultInner}>
              <p className={styles.resultTitle}>Your email is ready</p>
              <p>Open it in your mail app and press send. If no app opens, copy the message below and send it to {CONTACT_EMAIL}.</p>
              <pre>{result.text}</pre>
              <div className={styles.resultActions}>
                <a href={result.href} className="btn btn--mint btn--sm">
                  <Icon name="mail" size={16} />
                  Open in mail app
                </a>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => copy(result.text, 'msg')}>
                  <Icon name="copy" size={16} />
                  {copied === 'msg' ? 'Copied' : 'Copy message'}
                </button>
              </div>
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
