import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    threads: false,
    testTimeout: 10000,
    alias: {
      '@': '/src'
    },
    include: ['src/__tests__/**'],
  },
})
