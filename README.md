# Athar · Smart Sustainability Solutions

Landing page for EcoDesign's sustainability platform, built with Bun, Vite, React, React Three Fiber (three.js) and Motion.

## Develop

```sh
bun install
bun run dev        # http://localhost:5173
bun run build      # type-check + production build into dist/
bun run preview    # serve dist/
```

## Docker

```sh
docker build -t athar-landing-page .
docker run -p 8080:8080 athar-landing-page   # http://localhost:8080
```

Multi-stage: Bun builds the site, then an unprivileged nginx serves `dist/` with pre-gzipped assets
and immutable caching for hashed files.

## Media

- The walkthrough is embedded from YouTube (`VIDEO.youtubeId` in `src/content/site.ts`) behind a custom
  thumbnail; nothing loads from YouTube until the visitor presses play (privacy-enhanced `youtube-nocookie.com`).
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
public/media/     images and chapter thumbnails (AVIF + JPEG)
```

Animations respect `prefers-reduced-motion` (Motion's `reducedMotion="user"`, Lenis disabled, 3D auto-rotate off).
