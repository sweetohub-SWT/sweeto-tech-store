import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
  server: {
    open: true,
    host: true, // Exposes the frontend to the local network IP
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
})
