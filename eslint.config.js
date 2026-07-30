const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = [
    {
        ignores: ['dist/**', 'coverage/**', 'public/**'],
    },
    ...tsPlugin.configs['flat/recommended'],
    prettierRecommended,
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
            },
        },
        rules: {
            'no-console': 2,
            'no-var': 2,
            semi: 2,
            indent: 2,
            'no-multi-spaces': 2,
            'space-in-parens': 1,
            'no-multiple-empty-lines': 2,
            'prefer-const': 1,
            'no-use-before-define': 2,
            '@typescript-eslint/no-var-requires': 0,
        },
    },
    {
        // Whitebox tests need to reach into private members (utils, logger, ...),
        // so `any` casts are the pragmatic way to do that here.
        files: ['test/**/*.{ts,tsx}'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
];
