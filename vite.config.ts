import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

export default defineConfig({
  plugins: [react(), visualizer({ open: true })],
  base: '/',
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
    manifest: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        sw: path.resolve(__dirname, 'src/firebase-messaging-sw.ts'),
      },
      output: {
        entryFileNames: (chunk) => {
          // Keep SW name fixed
          return chunk.name === 'sw'
            ? 'firebase-messaging-sw.js'
            : 'assets/[name].[hash].js'
        },
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
})
