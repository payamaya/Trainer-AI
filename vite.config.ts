import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5174,
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:5174', // where Vercel's dev server runs
    //     changeOrigin: true,
    //   },
    // },
  },

  build: {
    outDir: 'dist',
    manifest: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
      },
    },
  },
})
