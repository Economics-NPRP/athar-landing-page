import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // `bun run dev:server` handles the contact form API during development.
  server: { proxy: { '/api': 'http://localhost:8080' } },
  build: {
    // The lazily loaded 3D chunk is mostly three.js itself.
    chunkSizeWarningLimit: 1000,
  },
});
