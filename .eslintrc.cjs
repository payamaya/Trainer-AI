// .eslintrc.cjs

const globals = require('globals')
const js = require('@eslint/js')
const typescriptEslint = require('@typescript-eslint/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')
const react = require('eslint-plugin-react')
const reactHooks = require('eslint-plugin-react-hooks')
const reactRefresh = require('eslint-plugin-react-refresh')

module.exports = [
  // Flat config for all files
  {
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    // The plugins key must be an object
    plugins: {
      '@typescript-eslint': typescriptEslint,
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Your custom rules go here
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-console': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // Ignore patterns
  {
    ignores: ['dist', 'functions/**', 'lib/**'],
  },
]
