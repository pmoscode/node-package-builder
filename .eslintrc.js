module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module' // Allows for the use of imports
    },
    extends: [
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'prettier', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
        'plugin:prettier/recommended' // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    rules: {
        'no-console': 2,
        'no-var': 2,
        'semi': 2,
        'indent': 2,
        'no-multi-spaces': 2,
        'space-in-parens': 1,
        'no-multiple-empty-lines': 2,
        'prefer-const': 1,
        'no-use-before-define': 2,
        '@typescript-eslint/no-var-requires': 0
    }
};
