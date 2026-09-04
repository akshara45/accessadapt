import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  base: './',

  build: {
    outDir: 'dist',
    emptyOutDir: true,

    rollupOptions: {
      input: {
        popup: resolve(import.meta.dirname, 'popup.html'),

        settings: resolve(
          import.meta.dirname,
          'settings.html'
        ),

        onboarding: resolve(
          import.meta.dirname,
          'onboarding.html'
        ),

        'content-script': resolve(
          import.meta.dirname,
          'src/content/index.js'
        ),
      },

      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'content-script') {
            return 'content-script.js';
          }

          return 'assets/[name]-[hash].js';
        },

        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});