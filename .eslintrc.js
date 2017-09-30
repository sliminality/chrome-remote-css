module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'plugin:flowtype/recommended'],
  plugins: ['flowtype'],
  rules: {
    'no-console': 'off',
  },
  env: {
    node: true,
    browser: true,
    es6: true,
  },
};
