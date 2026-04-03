import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', '@chenglou/pretext'],
  treeshake: true,
  target: 'es2020',
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
})
