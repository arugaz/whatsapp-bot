module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    eqeqeq: 0,
    indent: ['error', 2],
    'eol-last': ['error', 'never'],
    camelcase: 1,
    'no-var': 2,
    'no-unused-vars': 1,
    'no-unused-expressions': 0,
    'no-self-assign': 0,
    'no-undef': 0,
    'no-useless-escape': 0,
    'no-case-declarations': 0,
    'prefer-promise-reject-errors': 1,
    'object-property-newline': 0,
    'prefer-regex-literals': 0,
    quotes: ['error', 'single']
  }
}