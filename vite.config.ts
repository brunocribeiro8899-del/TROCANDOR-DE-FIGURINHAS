import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@pages':      path.resolve(__dirname, 'pages'),
      '@components': path.resolve(__dirname, 'components'),
      '@services':   path.resolve(__dirname, 'services'),
      '@hooks':      path.resolve(__dirname, 'hooks'),
      '@utils':      path.resolve(__dirname, 'utils'),
      '@types':      path.resolve(__dirname, 'types'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:80',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'backend/public/build',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react:  ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
})
