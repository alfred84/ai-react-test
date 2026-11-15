import { defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      restoreMocks: true,
      unstubGlobals: true,
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          // Bootstrap: only mounts <App /> into #root; covered by e2e.
          'src/main.tsx',
          // Test infrastructure (setup, MSW server, fixtures, helpers).
          'src/test/**',
          'src/**/*.test.{ts,tsx}',
          // Type-only declarations emit no runtime code.
          'src/**/*.d.ts',
        ],
        thresholds: {
          lines: 100,
          branches: 100,
          functions: 100,
          statements: 100,
        },
      },
    },
  }),
)
