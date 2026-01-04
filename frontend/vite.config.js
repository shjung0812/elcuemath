import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from '@tailwindcss/vite'

import tsChecker from 'vite-plugin-checker';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss(),
  tsChecker({ typescript: true }),

    // 
    // 
  ],
  base: '/renv/',

  css: {
    postcss: {
      plugins: [
        autoprefixer,
      ],
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://127.0.0.1:3000',
        ws: true,
        changeOrigin: true,
        secure: false
      },
      '/vdrg': {
        target: 'http://127.0.0.1:3000',
        ws: true,
        changeOrigin: true,
        secure: false
      },
      '/audiocall': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})