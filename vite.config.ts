import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    assetsDir: 'assets',
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        assetFileNames: assetInfo => {
          const info = assetInfo.name?.split('.') || []
          const extType = info[info.length - 1]

          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return `assets/images/[name].[hash][extname]`
          }
          if (/\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return `assets/fonts/[name].[hash][extname]`
          }
          return `assets/[name].[hash][extname]`
        },
      },
    },
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
})
