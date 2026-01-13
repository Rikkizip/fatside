import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  base: '/fatside/',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
})
