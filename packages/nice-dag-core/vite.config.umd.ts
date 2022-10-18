import { defineConfig } from 'vite'
import { resolve } from 'path'
export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: './lib',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
        formats: ['umd'],
        name: 'niceDag',
        fileName: 'index'
      },
    },
  }
)
