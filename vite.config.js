import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(import.meta.dirname, 'popup.html'),
        settings: resolve(import.meta.dirname, 'settings.html'),
        'content-script': resolve(import.meta.dirname, 'src/content/index.js'),
      },
      output: {
        entryFileNames: (chunk) =>
          chunk.name === 'content-script' ? 'content-script.js' : 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
