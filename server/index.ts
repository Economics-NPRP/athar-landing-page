import { join, resolve, sep } from 'node:path';
import type { BunFile } from 'bun';
import { BRIEFING_KEYS, validateBriefing, type BriefingFields } from '../src/sections/Contact/briefing';
import { mailConfigured, sendBriefing } from './mailer';

/** Serves the built site from dist/ and accepts briefing requests at POST /api/briefing. */
const ROOT = resolve(process.env.DIST_DIR ?? 'dist');
const SECURITY = { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Frame-Options': 'SAMEORIGIN' };

// shortcut: fixed-window limit kept in memory, so it resets on restart and isn't shared across replicas; move to Redis if you scale out.
const LIMIT = 5;
const WINDOW_MS = 10 * 60_000;
const hits = new Map<string, number>();
setInterval(() => hits.clear(), WINDOW_MS).unref();

export const server = Bun.serve({
  port: Number(process.env.PORT ?? 8080),
  maxRequestBodySize: 64 * 1024,
  routes: {
    '/healthz': new Response('ok'),
    '/api/briefing': { POST: handleBriefing },
  },
  fetch: serveStatic,
});

if (!mailConfigured) console.warn('SMTP is not configured: briefing requests will fail until SMTP_HOST and MAIL_FROM are set.');
console.log(`SMARTSS listening on http://localhost:${server.port}`);

async function handleBriefing(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || server.requestIP(req)?.address || 'unknown';
  const count = (hits.get(ip) ?? 0) + 1;
  hits.set(ip, count);
  if (count > LIMIT) return Response.json({ error: 'Too many requests. Try again in a few minutes.' }, { status: 429 });

  const body: unknown = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') return Response.json({ error: 'Invalid request.' }, { status: 400 });
  const data = body as Record<string, unknown>;

  // Honeypot: real visitors never see this field, so pretend it worked and send nothing.
  if (data.website) return Response.json({ ok: true });

  const f = Object.fromEntries(BRIEFING_KEYS.map(k => [k, typeof data[k] === 'string' ? data[k] : ''])) as BriefingFields;
  const errors = validateBriefing(f);
  if (Object.keys(errors).length) return Response.json({ errors }, { status: 422 });

  try {
    await sendBriefing(f);
    return Response.json({ ok: true });
  } catch (err) {
    console.error('Briefing email failed:', err instanceof Error ? err.message : err);
    return Response.json({ error: 'The message could not be sent.' }, { status: 502 });
  }
}

async function serveStatic(req: Request) {
  let pathname: string;
  try {
    pathname = decodeURIComponent(new URL(req.url).pathname);
  } catch {
    return new Response('Bad request', { status: 400, headers: SECURITY });
  }
  let path = join(ROOT, pathname);
  if (path !== ROOT && !path.startsWith(ROOT + sep)) return new Response('Not found', { status: 404, headers: SECURITY });

  let file = Bun.file(path);
  if (!(await file.exists())) {
    if (/^\/(assets|media)\//.test(pathname)) return new Response('Not found', { status: 404, headers: SECURITY });
    path = join(ROOT, 'index.html');
    file = Bun.file(path);
  }

  const headers = new Headers({ ...SECURITY, 'Cache-Control': cacheControl(pathname), 'Content-Type': file.type, 'Accept-Ranges': 'bytes' });

  const range = req.headers.get('range');
  if (range) {
    const partial = byteRange(file, range, headers);
    if (partial) return partial;
  }

  const gz = Bun.file(`${path}.gz`);
  if (/\bgzip\b/.test(req.headers.get('accept-encoding') ?? '') && (await gz.exists())) {
    headers.set('Content-Encoding', 'gzip');
    headers.set('Vary', 'Accept-Encoding');
    return new Response(gz, { headers });
  }
  return new Response(file, { headers });
}

function cacheControl(pathname: string) {
  if (pathname.startsWith('/assets/')) return 'public, max-age=31536000, immutable'; // hashed build output
  if (pathname.startsWith('/media/')) return 'public, max-age=604800';
  return 'no-cache';
}

/** Single byte ranges, so the walkthrough video can seek. Anything else gets the whole file. */
function byteRange(file: BunFile, range: string, headers: Headers) {
  const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (!m || (!m[1] && !m[2])) return null;
  const size = file.size;
  const start = m[1] ? Number(m[1]) : Math.max(0, size - Number(m[2]));
  const end = m[1] && m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
  if (start > end || start >= size) {
    headers.set('Content-Range', `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }
  headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  return new Response(file.slice(start, end + 1), { status: 206, headers });
}
