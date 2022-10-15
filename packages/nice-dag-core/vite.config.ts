import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import pkg from './package.json'
export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: './lib',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
        formats: ['es', 'cjs'],
        fileName: 'index'
      },
      rollupOptions: {
        external: [...Object.keys(pkg.dependencies || {})]
      }
    },
    plugins: [
      dts({
          insertTypesEntry: true
      })
    ]
  }
)
