import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // /apiで始まるリクエストをGoのバックエンドサーバーに転送
      '/api': 'http://localhost:8080',
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})