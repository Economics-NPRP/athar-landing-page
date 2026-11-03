# syntax=docker/dockerfile:1

# ---- Build: compile the static site and bundle the server with Bun ----
# Output is platform-independent JS and static files, so build once on the runner arch.
FROM --platform=$BUILDPLATFORM oven/bun:1-alpine AS build
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY index.html tsconfig.json vite.config.ts ./
COPY public ./public
COPY src ./src
COPY server ./server
RUN bun run build && bun run build:server \
 # Pre-compress text assets once so the server can send them gzipped with no per-request CPU.
 && find dist -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' -o -name '*.svg' -o -name '*.json' \) \
      -exec gzip -9 -k {} \;

# ---- Runtime: one Bun process serves dist/ and the contact form API ----
FROM oven/bun:1-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=8080
COPY --from=build /app/dist ./dist
COPY --from=build /app/dist-server/index.js ./server.js
USER bun

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
CMD ["bun", "server.js"]
