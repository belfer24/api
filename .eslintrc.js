module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },

  parser: '@typescript-eslint/parser',

  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },

  plugins: ['@typescript-eslint'],

  extends: ['airbnb-typescript/base', 'prettier'],

  rules: {
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/return-await': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-useless-constructor': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        leadingUnderscore: 'allowSingleOrDouble',
        trailingUnderscore: 'allowSingleOrDouble',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'],
      },
    ],
  },

  ignorePatterns: ['.eslintrc.js'],
};
