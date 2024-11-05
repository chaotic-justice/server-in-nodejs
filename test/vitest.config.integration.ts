import { resolve } from 'path'
import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.int.spec.ts', 'test/*.int.spec.ts'],
    globals: true,
    alias: {
      '@src': './src',
      '@test': './test',
    },
    root: './',
    setupFiles: ['./test/helpers/setup.ts'],
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, './src') }],
    // alias: {
    //   '@src': './src',
    //   '@test': './test',
    // },
  },
  plugins: [swc.vite()],
})
