# syntax=docker/dockerfile:1

# ---- Build: compile the static site with Bun ----
# Output is static files, so build once on the runner arch; only the nginx stage is per-platform.
FROM --platform=$BUILDPLATFORM oven/bun:1-alpine AS build
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY index.html tsconfig.json vite.config.ts ./
COPY public ./public
COPY src ./src
RUN bun run build \
 # Pre-compress text assets once so nginx serves them with gzip_static (no per-request CPU).
 && find dist -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' -o -name '*.svg' -o -name '*.json' \) \
      -exec gzip -9 -k {} \;

# ---- Runtime: unprivileged nginx serving dist/ ----
FROM nginxinc/nginx-unprivileged:1-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
