import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  server: {
    port: 3000,
    open: false
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        zafabit: resolve(__dirname, 'zafabit.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
        deletion: resolve(__dirname, 'deletion.html'),
        refund: resolve(__dirname, 'refund.html')
      },
      output: {
        manualChunks: {
          three: ['three']
        }
      }
    }
  }
});

