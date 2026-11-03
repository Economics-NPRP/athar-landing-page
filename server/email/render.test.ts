import { expect, test } from 'bun:test';
import { renderBriefing } from './render';

const f = { name: 'Sara\nBcc: x@evil.test', org: '', email: 'sara@example.qa', site: 'Villa', interest: 'Hosting a pilot', msg: '<script>alert(1)</script>\nline two' };

test('renders subject, escapes HTML and keeps one-line fields on one line', () => {
  const { subject, html, text } = renderBriefing(f, new Date('2026-11-03T09:00:00Z'));
  expect(subject).toBe('Briefing request: Sara Bcc: x@evil.test · Villa');
  expect(html).not.toContain('<script>');
  expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;<br>line two');
  expect(html).toContain('wants to talk about hosting a pilot');
  expect(text).toContain('Organization:  —');
  expect(text).toContain('on 3 Nov 2026 at 12:00 (Doha time)');
});
