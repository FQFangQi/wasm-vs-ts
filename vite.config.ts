import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/wasm-vs-ts/', // 添加这一行，仓库名称
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['@assemblyscript/loader'],
  },
  server: {
    fs: {
      // Allow serving files from build directory
      allow: ['..'],
    },
  },
})