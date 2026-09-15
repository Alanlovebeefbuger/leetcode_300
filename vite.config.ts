import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  worker: {
    format: 'es',
  },
  optimizeDeps: {
    // PGlite 自带 wasm 与 data 资源，预打包会破坏其资源解析
    exclude: ['@electric-sql/pglite'],
  },
})
