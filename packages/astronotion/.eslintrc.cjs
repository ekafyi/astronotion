/** @type {import("@types/eslint").Linter.Config} */
module.exports = {
  env: {
    node: true,
    browser: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "eslint-config-prettier",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  settings: {
    "import/resolver": { typescript: {} },
  },
  rules: {
    "import/order": ["warn", { alphabetize: { order: "asc", caseInsensitive: true } }],
  },
  // overrides: [],
};
