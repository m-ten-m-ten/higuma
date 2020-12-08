module.exports = {
  ignorePatterns: ['!.eslintrc.js', '!.prettierrc.js', '!.stylelintrc.js'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  plugins: ['@typescript-eslint', 'jquery'],
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
    jquery: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    // 必要に応じてルールを追加
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
