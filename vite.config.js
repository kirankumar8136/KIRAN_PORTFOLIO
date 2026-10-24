import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Allow relative paths so the built output can run anywhere or preview easily
  server: {
    port: 3000,
    open: true
  }
});
