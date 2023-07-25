// @ts-expect-error
import typescript from '@rollup/plugin-typescript';
import * as path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  // https://vitejs.dev/guide/build.html#library-mode
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-router-dom', 'react-router'],
      plugins: [
        typescript({
          sourceMap: false,
          declaration: true,
          outDir: 'dist',
          exclude: ['**/__tests__'],
        }),
      ],
    },
  },
})