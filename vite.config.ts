/// <reference types="vitest" />

import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    include: ['tests/*.test.{ts,tsx}'],
    testTimeout: 2_000,
  },
})
