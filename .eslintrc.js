module.exports = {
  root: true,
  extends: 'airbnb-base',
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    // allow reassigning param
    'no-param-reassign': [2, { props: false }],
    'linebreak-style': ['error', 'unix'],
    'import/extensions': ['error', {
      js: 'always',
    }],
  },
  overrides: [
    {
      files: ['test/**/*.js', '**/*.test.js', '**/*.spec.js'],
      rules: {
        // allow devDependencies in test files
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      },
    },
  ],
};
