# SMARTSS · Smart Sustainability Solutions

Landing page for EcoDesign's sustainability platform, built with Bun, Vite, React, React Three Fiber (three.js) and Motion.

## Develop

```sh
bun install
bun run dev          # http://localhost:5173
bun run dev:server   # contact form API on :8080 (Vite proxies /api to it)
bun run build        # type-check + production build into dist/
bun run start        # serve dist/ and the API with the Bun server
bun test server      # server and email template tests
```

## Docker

```sh
docker build -t smartss-landing-page .
docker run -p 8080:8080 --env-file .env smartss-landing-page   # http://localhost:8080
```

Multi-stage: Bun builds the site and bundles `server/` into one file; the runtime image runs it as a
non-root user. The server sends pre-gzipped assets, caches hashed files forever, serves byte ranges for the video
and adds security headers.

## Contact form email

"Request a briefing" posts to `POST /api/briefing`. The server validates it again (same rules as the form, in
`src/sections/Contact/briefing.ts`), then emails it to `admin@ecodesign.global` (`CONTACT_EMAIL` in `src/content/site.ts`)
with Reply-To set to the visitor. Limited to 5 requests per IP every 10 minutes, with a hidden honeypot field for bots.

The email is `server/email/briefing-request.html` (open it in a browser to preview) and `briefing-request.txt`.
The subject comes from the HTML `<title>`.

Set these environment variables for SMTP (any provider: Microsoft 365, Google Workspace, SES, Postmark, ...):

| Variable    | Example                                          |
| ----------- | ------------------------------------------------ |
| `SMTP_HOST` | `smtp.office365.com`                             |
| `SMTP_PORT` | `587` (default; `465` switches to implicit TLS)  |
| `SMTP_USER` | `no-reply@ecodesign.global`                      |
| `SMTP_PASS` | app password or API key                          |
| `MAIL_FROM` | `SMARTSS website <no-reply@ecodesign.global>` (defaults to `SMTP_USER`) |

Without `SMTP_HOST` the site still works, but the form shows an error and points visitors to the email address.

## Media

- The walkthrough is `public/media/sss-walkthrough.mp4`, shown behind a custom thumbnail until the visitor presses play.
  Encoded with `ffmpeg -i in.mp4 -c:v libx264 -preset slow -crf 26 -c:a aac -b:a 96k -movflags +faststart out.mp4`.
- Photos ship as AVIF (rendered through `<Picture>`) with losslessly optimized JPEG fallbacks; the logo is lossless WebP.
  To add an image, drop `name.jpg` in `public/media/` and run `avifenc -q 80 -s 2 name.jpg name.avif`.

## Structure

```
src/
  content/        copy, section data and simulated dashboard data
  components/
    layout/       nav, footer, preloader, cursor, smooth scroll, scroll progress
    motion/       reusable animation primitives (split text, reveal, counter, magnetic, marquee)
    ui/           icon, button link, section header
    charts/       sparkline and carbon bar chart (SVG)
  sections/       one folder per page section, each with its CSS module
  three/          R3F diorama; world/ builds the procedural Qatar models
  hooks/          small shared hooks
  styles/         design tokens and global primitives
server/           Bun server: static files, /api/briefing, email/ templates
public/media/     walkthrough video, images and chapter thumbnails (AVIF + JPEG)
```

Animations respect `prefers-reduced-motion` (Motion's `reducedMotion="user"`, Lenis disabled, 3D auto-rotate off).
