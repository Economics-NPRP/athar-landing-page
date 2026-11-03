import { INTERESTS, SITE_TYPES } from '../../content/site';

export type BriefingFields = { name: string; org: string; email: string; site: string; interest: string; msg: string };
export type BriefingErrors = Partial<Record<keyof BriefingFields, string>>;

export const BRIEFING_KEYS: (keyof BriefingFields)[] = ['name', 'org', 'email', 'site', 'interest', 'msg'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { name: 120, org: 160, email: 254, msg: 5000 };

/** Shared by the form and the server, which re-checks every request. */
export function validateBriefing(f: BriefingFields): BriefingErrors {
  const errs: BriefingErrors = {};
  if (!f.name.trim()) errs.name = 'Enter your name.';
  else if (f.name.length > MAX.name) errs.name = `Keep your name under ${MAX.name} characters.`;
  if (f.org.length > MAX.org) errs.org = `Keep the organization under ${MAX.org} characters.`;
  if (f.email.length > MAX.email || !EMAIL_RE.test(f.email.trim())) errs.email = 'Enter a valid email address, like name@organization.qa.';
  if (!SITE_TYPES.includes(f.site)) errs.site = 'Choose a type of site.';
  if (!INTERESTS.includes(f.interest)) errs.interest = 'Choose what you are interested in.';
  if (!f.msg.trim()) errs.msg = 'Add a short message about your site.';
  else if (f.msg.length > MAX.msg) errs.msg = `Keep the message under ${MAX.msg} characters.`;
  return errs;
}
