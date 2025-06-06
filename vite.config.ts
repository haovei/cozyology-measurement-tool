import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/cmt-[name]-[hash].js',
        chunkFileNames: 'assets/cmt-[name]-[hash].js',
        assetFileNames: 'assets/cmt-[name]-[hash].[ext]'
      },
    },
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
})
