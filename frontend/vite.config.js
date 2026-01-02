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
        target: 'http://localhost', // 80번 포트로 가정
        changeOrigin: true,
        secure: false,
      }
    }
  }
})