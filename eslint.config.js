import js from '@eslint/js'
import pluginQuery from '@tanstack/eslint-plugin-query'
import vitest from '@vitest/eslint-plugin'
import prettierConfig from 'eslint-config-prettier'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import testingLibrary from 'eslint-plugin-testing-library'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const testFiles = ['src/**/*.test.{ts,tsx}', 'src/test/**/*.{ts,tsx}']

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'playwright-report', 'test-results']),

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
      pluginQuery.configs['flat/recommended'],
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },

  {
    files: testFiles,
    extends: [testingLibrary.configs['flat/react'], vitest.configs.recommended],
  },

  {
    // Vitest runs with globals disabled, so RTL cannot register its automatic cleanup.
    files: ['src/test/setup.ts'],
    rules: { 'testing-library/no-manual-cleanup': 'off' },
  },

  {
    files: ['**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },

  prettierConfig,
])
