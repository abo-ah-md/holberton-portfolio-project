import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh for instant hot reload
      fastRefresh: true,
    }),
    tailwindcss()
  ],

  server: {
    // Hot Module Replacement configuration
    hmr: {
      overlay: true, // Show errors as overlay in browser
    },

    // File watching configuration
    watch: {
      usePolling: true, // Use polling for better compatibility (especially on Windows)
      interval: 100, // Check for file changes every 100ms
    },

    // Development server settings
    host: true, // Listen on all addresses (0.0.0.0)
    port: 5173, // Default Vite port
    open: true, // Auto-open browser on server start
  },
})