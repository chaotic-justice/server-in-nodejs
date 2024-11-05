import { resolve } from 'path'
import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  root: './',
  test: {
    include: ['src/**/*.int.spec.ts', 'test/*.int.spec.ts'],
    globals: true,
    environment: 'node',
    includeSource: [resolve(__dirname, '.')],
    setupFiles: ['./test/helpers/setup.ts'],
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, './src') },
      { find: 'express', replacement: require.resolve('express') },
    ],
  },
  esbuild: false,
  plugins: [swc.vite()],
})
