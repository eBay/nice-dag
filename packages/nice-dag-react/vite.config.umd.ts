import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import pkg from './package.json'
export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: './lib',
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'niceDagReact',
      fileName: 'index',
      formats: ['umd']
    },
    rollupOptions: {
      external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})]
    }
  },
  plugins: [
    react(),
  ]
})
