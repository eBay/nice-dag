import { defineConfig } from 'vite'
import vue from "@vitejs/plugin-vue";
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import pkg from './package.json'
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: './lib',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})]
    }
  },
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true
    })
  ]
})
