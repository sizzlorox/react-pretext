import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/react-pretext/',
  resolve: {
    alias: {
      // Import directly from source so the demo always reflects latest code
      'react-pretext': path.resolve(__dirname, '../src/index.ts'),
    },
  },
})
