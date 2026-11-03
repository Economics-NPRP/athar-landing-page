import { afterAll, expect, test } from 'bun:test';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dist = mkdtempSync(join(tmpdir(), 'smartss-'));
mkdirSync(join(dist, 'media'));
writeFileSync(join(dist, 'index.html'), '<!doctype html><title>SMARTSS</title>');
writeFileSync(join(dist, 'media', 'clip.mp4'), '0123456789');
process.env.PORT = '0';
process.env.DIST_DIR = dist;
delete process.env.SMTP_HOST;

const { server } = await import('./index');
const url = (p: string) => new URL(p, server.url);
afterAll(() => server.stop());

test('serves files with security headers and falls back to index.html', async () => {
  const r = await fetch(url('/some/page'));
  expect(r.status).toBe(200);
  expect(r.headers.get('x-content-type-options')).toBe('nosniff');
  expect(await r.text()).toContain('SMARTSS');
  expect((await fetch(url('/media/missing.jpg'))).status).toBe(404);
});

test('does not escape dist/', async () => {
  const r = await fetch(url('/..%2f..%2f..%2f..%2fetc%2fpasswd'));
  expect(r.status).toBe(404);
});

test('serves byte ranges for video seeking', async () => {
  const r = await fetch(url('/media/clip.mp4'), { headers: { Range: 'bytes=2-5' } });
  expect(r.status).toBe(206);
  expect(r.headers.get('content-range')).toBe('bytes 2-5/10');
  expect(await r.text()).toBe('2345');
  expect((await fetch(url('/media/clip.mp4'), { headers: { Range: 'bytes=20-' } })).status).toBe(416);
});

const post = (body: unknown) => fetch(url('/api/briefing'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const valid = { name: 'Sara', org: '', email: 'sara@example.qa', site: 'Villa', interest: 'Hosting a pilot', msg: 'Hello' };

test('rejects invalid briefings and fakes success for bots', async () => {
  const bad = await post({ ...valid, email: 'nope', site: 'Moon base' });
  expect(bad.status).toBe(422);
  expect(Object.keys((await bad.json()).errors).sort()).toEqual(['email', 'site']);
  expect((await post({ ...valid, website: 'spam.example' })).status).toBe(200);
});

test('reports a send failure when SMTP is not configured', async () => {
  expect((await post(valid)).status).toBe(502);
});
