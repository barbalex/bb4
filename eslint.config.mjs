// flat config (eslint 10); migrated from .eslintrc.cjs / .eslintignore
import js from '@eslint/js'
import globals from 'globals'
import qwik from 'eslint-plugin-qwik'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '**/*.log',
      '**/.DS_Store',
      '.history',
      '.yarn',
      'bazel-*',
      'dist',
      'dist-dev',
      'lib',
      'lib-types',
      'etc',
      'external',
      'temp',
      'tsc-out',
      'tsdoc-metadata.json',
      'target',
      'output',
      'build',
      '.cache',
      '.vscode',
      '.rollup.cache',
      'tsconfig.tsbuildinfo',
      'vite.config.ts',
      '*.spec.tsx',
      '*.spec.ts',
      '.netlify',
      'server',
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    // eslint-plugin-qwik still ships eslintrc-style presets, wire it flat
    plugins: { qwik },
    rules: qwik.configs.recommended.rules,
  },
  {
    files: ['src/**/*.ts*'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'prefer-spread': 'off',
      'no-case-declarations': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/consistent-type-imports': 'warn',
    },
  }
)
