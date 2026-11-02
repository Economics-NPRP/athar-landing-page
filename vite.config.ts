import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // The lazily loaded 3D chunk is mostly three.js itself.
    chunkSizeWarningLimit: 1000,
  },
});
