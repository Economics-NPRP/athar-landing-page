import { CONTACT_EMAIL } from '../../content/site';

export type BriefingFields = { name: string; org: string; email: string; site: string; interest: string; msg: string };
export type BriefingErrors = Partial<Record<keyof BriefingFields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUBJECT = 'Smart Sustainability Solutions: briefing request';

export function validateBriefing(f: BriefingFields): BriefingErrors {
  const errs: BriefingErrors = {};
  if (!f.name.trim()) errs.name = 'Enter your name.';
  if (!EMAIL_RE.test(f.email.trim())) errs.email = 'Enter a valid email address, like name@organization.qa.';
  if (!f.msg.trim()) errs.msg = 'Add a short message about your site.';
  return errs;
}

export function buildBriefingEmail(f: BriefingFields) {
  const body = [
    `Name: ${f.name}`,
    `Organization: ${f.org || '—'}`,
    `Email: ${f.email}`,
    `Type of site: ${f.site}`,
    `Interested in: ${f.interest}`,
    '',
    f.msg,
  ].join('\n');
  return {
    text: `To: ${CONTACT_EMAIL}\nSubject: ${SUBJECT}\n\n${body}`,
    href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(body)}`,
  };
}
