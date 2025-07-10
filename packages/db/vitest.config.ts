import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    testTimeout: 10000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/**/*.ts'
      ],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        'src/__mocks__/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'prisma/',
        'src/scripts/',
        'generated/'
      ],
      thresholds: {
        global: {
          statements: 70,
          branches: 70,
          functions: 70,
          lines: 70
        }
      },
      reportOnFailure: true,
      all: true
    }
  }
})