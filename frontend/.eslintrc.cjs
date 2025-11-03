require("@rushstack/eslint-config/patch/modern-module-resolution");
const path = require("path");

module.exports = {
  extends: [
    "@rushstack/eslint-config/profile/web-app",
    "@rushstack/eslint-config/mixins/react",
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: true,
  },
  settings: {
    react: { version: "19.1" },
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "react/jsx-no-bind": "off",
    "no-relative-import-paths/no-relative-import-paths": [
      "warn",
      { allowSameFolder: true, rootDir: "src", prefix: "@" },
    ],
  },
};
