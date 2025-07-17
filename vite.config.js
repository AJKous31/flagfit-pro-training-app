import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    host: 'localhost',
    strictPort: true,
    hmr: {
      port: 5174,
      host: 'localhost'
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.js']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: ['pocketbase']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pocketbase: ['pocketbase']
        }
      }
    }
  }
}) 