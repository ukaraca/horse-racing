import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import vueParser from "vue-eslint-parser";
import prettier from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,ts,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        ecmaFeatures: { jsx: false },
      },
    },
    plugins: {
      vue,
      "@typescript-eslint": typescript,
      prettier,
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      /* ---- General ---- */
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

      /* ---- Vue ---- */
      "vue/multi-word-component-names": "off", // component adları tek kelime olabilir
      "vue/html-indent": ["error", 2],
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "never",
            normal: "never",
            component: "always",
          },
        },
      ],
      "vue/max-attributes-per-line": [
        "error",
        {
          singleline: { max: 3 },
          multiline: { max: 1 },
        },
      ],

      /* ---- TypeScript ---- */
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      /* ---- Imports ---- */
      "import/order": "off",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      /* ---- Prettier ---- */
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          semi: true,
          trailingComma: "all",
          printWidth: 100,
          tabWidth: 2,
          endOfLine: "auto",
        },
      ],
    },
  },
  {
    files: ["*.vue"],
    rules: {
      "max-lines": "off",
    },
  },
  {
    ignores: ["dist/", "node_modules/", "vite.config.ts", "postcss.config.cjs"],
  },
];
