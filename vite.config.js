import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: '.', // 設置根目錄為專案根目錄
  build: {
    outDir: 'dist', // 將構建輸出目錄改為 dist
    emptyOutDir: true, // 構建前清空輸出目錄
  },
  server: {
    proxy: {
      '/auth': 'http://localhost:3000',
      '/chat': 'http://localhost:3000',
      '/messages': 'http://localhost:3000'
    }
  },
  publicDir: 'public', // 保持靜態資源目錄為 public
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})