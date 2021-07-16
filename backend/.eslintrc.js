module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
  },
  plugins: [
    'react',
  ],
  rules: {
    'no-use-before-define': [
      'error', { functions: false, classes: false, variables: false },
    ],
    'arrow-parens': [
      'error', 'as-needed',
    ],
    'linebreak-style': [
      'error',
      'windows',
    ],
  },
};
