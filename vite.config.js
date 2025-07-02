import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://web-backend:5000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      }
    }
  },
  // Setting up the test folder
  test: {
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    environment: 'jsdom',
    setupFiles: ['tests/setup.js'],
  },
});
