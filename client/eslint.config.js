import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "eslint-plugin-typescript";
import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ["dist", "node_modules"] },
  {
    extends: [
      "js.configs.recommended",
      "eslint:recommended",
      "plugin:react/recommended",
      "tseslint.configs.recommended",
    ],
  },

  {
    files: ["**/*.{js,mjs,cjs,jsx}", "**/*.{ts,tsx}"],
    parserOptions: { ecmaVersion: 2021, sourceType: "module" },
  },
  {
    languageOptions: {
      ecmaFeatures: { jsx: true },
      ecmaVersion: 2021,
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: ["react-hooks", "react-refresh", "react"],
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/no-double-underscore": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    overrides: [
      {
        files: ["**/*.ts", "**/*.tsx"],
        parser: "@typescript-eslint/parser",
        parserOptions: {
          ecmaVersion: 2021,
          sourceType: "module",
          project: "./tsconfig.json",
        },
        plugins: ["@typescript-eslint"],
        extends: ["plugin:@typescript-eslint/recommended"],
        rules: {
          "@typescript-eslint/explicit-module-boundary-types": "off",
          "@typescript-eslint/no-explicit-any": "off",
          "@typescript-eslint/no-unused-vars": "off",
          "@typescript-eslint/no-var-requires": "off",
        },
      },
    ],
  },
];
// Compare this snippet from client/vite.config.js:
