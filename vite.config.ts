import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Production builds are served from https://<user>.github.io/reknow-bingo/
  // on GitHub Pages; the dev server stays at the root path.
  base: command === 'build' ? '/reknow-bingo/' : '/',
}))
