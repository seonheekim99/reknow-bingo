import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages serves this from /reknow-bingo/; Vercel serves it from
  // the domain root and sets VERCEL=1 during its build. The dev server
  // always stays at the root path.
  base: command === 'build' && !process.env.VERCEL ? '/reknow-bingo/' : '/',
}))
