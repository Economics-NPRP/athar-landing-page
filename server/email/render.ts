import htmlTemplate from './briefing-request.html' with { type: 'text' };
import text from './briefing-request.txt' with { type: 'text' };
import type { BriefingFields } from '../../src/sections/Contact/briefing';

// Bun types .html imports as HTML bundles; `type: 'text'` makes this the file's contents.
const html = htmlTemplate as unknown as string;
const SUBJECT = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? 'Briefing request: {{name}}';
const DOHA = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Qatar', dateStyle: 'medium', timeStyle: 'short' });
const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, c => ESC[c]);
const fill = (tpl: string, vars: Record<string, string>, encode: (v: string) => string) =>
  tpl.replace(/{{(\w+)}}/g, (tag, key: string) => (key in vars ? encode(vars[key]) : tag));

/** Fills the briefing-request templates with a validated submission. */
export function renderBriefing(f: BriefingFields, at = new Date()) {
  // Collapse whitespace in one-line fields so nothing can break out of the subject line or table cells.
  const line = (s: string) => s.replace(/\s+/g, ' ').trim();
  const vars = {
    name: line(f.name),
    org: line(f.org) || '—',
    email: line(f.email),
    site: line(f.site),
    interest: line(f.interest),
    interest_lower: line(f.interest).replace(/^./, c => c.toLowerCase()),
    msg: f.msg.trim(),
    sent_at: DOHA.format(at),
  };
  return {
    subject: fill(SUBJECT, vars, v => v),
    html: fill(html, vars, v => escapeHtml(v).replace(/\r?\n/g, '<br>')),
    text: fill(text, vars, v => v),
  };
}
