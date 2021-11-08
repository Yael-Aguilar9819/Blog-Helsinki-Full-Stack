module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
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
    'no-underscore-dangle': 'off',
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
    //Only omitted to the jsx files
    "react/jsx-filename-extension": [
      1, { 
        "extensions": [".js", ".jsx"] 
      }],
    "react/react-in-jsx-scope": "off",
  }
};
