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
    /**
     * @link https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/extensions.md
     * @desc
     * Some file resolve algorithms allow you to omit the file extension within the import source path.
     * For example the node resolver can resolve ./foo/bar to the absolute path /User/someone/foo/bar.js because the .js extension is resolved automatically by default.
     * Depending on the resolver you can configure more extensions to get resolved automatically.
     */
    'import/extensions': 'off',
    /**
     * @link https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-extraneous-dependencies.md
     * @desc
     * Forbid the import of external modules that are not declared in the package.json’s dependencies, devDependencies, optionalDependencies,
     * peerDependencies, or bundledDependencies. The closest parent package.json will be used. If no package.json is found, the rule will not lint anything.
     * This behavior can be changed with the rule option packageDir.
     */
    'import/no-extraneous-dependencies': 'off',
    /**
     * @desc Disallow variable declarations from shadowing variables declared in the outer scope.
     * @link https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-shadow.md
     */
    '@typescript-eslint/no-shadow': 'off',
    /**
     * @desc Disallow custom TypeScript modules and namespaces.
     * @link https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-namespace.md
     */
    '@typescript-eslint/no-namespace': 'off',
    /**
     * @desc Disallow the use of variables before they are defined.
     * @link https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-use-before-define.md
     */
    '@typescript-eslint/no-use-before-define': 'off',
    /**
     * @desc Disallow unnecessary constructors.
     * @link https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-useless-constructor.md
     */
    '@typescript-eslint/no-useless-constructor': 'off',
    /**
     * @desc Disallow unused variables.
     * @link https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-unused-vars.md
     */
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    /**
     * @desc Enforce naming conventions for everything across a codebase.
     * @link https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/naming-convention.md
     */
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
