import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth'],
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://job-portal-server-six-eosin.vercel.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      }
    }
  }
});