import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import vue from "@vitejs/plugin-vue";
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "./lib",
    lib: {
      entry: resolve(__dirname, "src/index.vue"),
      formats: ["es", "cjs"],
      fileName: "index",
    },
    rollupOptions: {
      external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})]
    },
  },
  plugins: [vue(), dts({ insertTypesEntry: true })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
