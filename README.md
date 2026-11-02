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

Multi-stage: Bun builds the site, then an unprivileged nginx serves `dist/` with pre-gzipped assets,
immutable caching for hashed files and byte-range support for the walkthrough video.

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
public/media/     images, chapter thumbnails and the walkthrough video
```

Animations respect `prefers-reduced-motion` (Motion's `reducedMotion="user"`, Lenis disabled, 3D auto-rotate off).
