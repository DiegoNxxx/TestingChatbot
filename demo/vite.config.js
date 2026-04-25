import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      '/tasks': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/users': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js"
  }
})