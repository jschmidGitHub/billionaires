import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  base: '/customers/',

  server: {
    host: '0.0.0.0', // Ensures it binds to all interfaces
    port: 5174,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'jschmid.xyz'
    ]
  },

  preview: {
    host: '0.0.0.0',
    port: 4174,
    strictPort: true,
  },
})
