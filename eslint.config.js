import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
    { ignores: ['dist', '.docker', '.firebase'] },
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
            /*
             * Code style
             */
            'indent': ['error', 4, { SwitchCase: 1 }],
            'quotes': ['error', 'single'],
            'semi': ['error', 'never'],
        },
    },
    {
        // Configuration files and module run within nodes
        files: ['*.cjs', 'vite.config.js', 'vitest.config.js'],
        languageOptions: {
            globals: globals.node,
        }
    },
]

