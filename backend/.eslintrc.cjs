require('@rushstack/eslint-config/patch/modern-module-resolution');
const path = require('path');

module.exports = {
  extends: ['@rushstack/eslint-config/profile/node-trusted-tool'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: true,
  },
  rules: {
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/parameter-properties': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
};
