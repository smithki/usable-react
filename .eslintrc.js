const javascriptRules = {
  // Core ESLint
  'no-console': 'off',
  'func-names': 'off',
  'guard-for-in': 'off',
  'prefer-const': 'off',
  'no-return-assign': 'off',
  'no-nested-ternary': 'off',
  'no-underscore-dangle': 'off',
  'no-prototype-builtins': 'off',
  'no-useless-constructor': 'off',
  'class-methods-use-this': 'off',

  // React
  'react/jsx-pascal-case': 'off',
  'react/react-in-jsx-scope': 'off', // Not required with >= React 18
  'react/require-default-props': 'off',
  'react/jsx-no-useless-fragment': 'off',
  'react/destructuring-assignment': 'off', // VSCode doesn't support automatically destructuring; it's a pain to add a new variable

  // Imports
  'import/no-extraneous-dependencies': 'off',
  'unused-imports/no-unused-imports': 'error',
  'unused-imports/no-unused-vars': 'off',
};

const typescriptRules = {
  ...javascriptRules,
  'no-shadow': 'off', // Breaks with enums :(
  '@typescript-eslint/no-shadow': 'error',

  'consistent-return': 'off', // TypeScript effectively obsoletes this rule
  '@typescript-eslint/comma-dangle': 'off', // Avoid conflict between ESLint and Prettier
  '@typescript-eslint/no-unused-vars': 'off', // Obsolete because 'unused-vars' plugin

  // Turning off some TypeScript rules that are too strict & just noisy...
  '@typescript-eslint/ban-types': 'off',
  '@typescript-eslint/no-redeclare': 'off',
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/no-unsafe-call': 'off',
  '@typescript-eslint/no-for-in-array': 'off',
  '@typescript-eslint/no-unsafe-return': 'off',
  '@typescript-eslint/no-empty-function': 'off',
  '@typescript-eslint/no-unsafe-argument': 'off',
  '@typescript-eslint/no-floating-promises': 'off',
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-member-access': 'off',
  '@typescript-eslint/restrict-template-expressions': 'off',
};

module.exports = {
  // JavaScript configuration
  plugins: ['unused-imports'],
  extends: [
    '@ikscodes/eslint-config/rules/airbnb',
    '@ikscodes/eslint-config/rules/eslint',
    '@ikscodes/eslint-config/rules/prettier',
  ],
  rules: javascriptRules,

  overrides: [
    // TypeScript configuration
    {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: ['@typescript-eslint', 'unused-imports'],
      extends: [
        '@ikscodes/eslint-config/rules/airbnb',
        '@ikscodes/eslint-config/rules/typescript',
        '@ikscodes/eslint-config/rules/eslint',
        '@ikscodes/eslint-config/rules/prettier',
      ],
      parserOptions: { project: './tsconfig.json' },
      rules: typescriptRules,
    },
  ],
};
