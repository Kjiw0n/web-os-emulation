require("@rushstack/eslint-patch/modern-module-resolution");
const path = require("path");

module.exports = {
  extends: [
    "@rushstack/eslint-config/profile/web-app",
    "@rushstack/eslint-config/mixins/react",
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [path.resolve(__dirname, "tsconfig.eslint.json")],
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
    react: { version: "19.1" },
  },
  plugins: ["no-relative-import-paths"],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "react/jsx-no-bind": "off",
    "@rushstack/typedef-var": "off",
    "no-relative-import-paths/no-relative-import-paths": [
      "warn",
      { allowSameFolder: true, rootDir: "frontend/src", prefix: "@" },
    ],
  },
  "@typescript-eslint/naming-convention": [
    "error",
    {
      selector: "interface",
      format: ["PascalCase"],
      custom: {
        regex: "^I[A-Z]",
        match: false,
      },
    },
  ],
};
