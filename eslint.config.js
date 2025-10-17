import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import vue from "eslint-plugin-vue";
import globals from "globals";
import vueParser from "vue-eslint-parser";

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
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      vue,
      "@typescript-eslint": typescript,
      prettier,
    },
    rules: {
      /* ---- General ---- */
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

      /* ---- Vue ---- */
      "vue/multi-word-component-names": "off", // component adları tek kelime olabilir
      "vue/max-attributes-per-line": "off",
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

      /* ---- TypeScript ---- */
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      /* ---- Imports ---- */
      "import/order": "off",

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
    files: ["**/*.vue"],
    rules: {
      "max-lines": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: ["**/*.test.ts", "**/*.test.js", "**/__tests__/**/*"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        vi: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["**/store/types.ts"],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    ignores: ["dist/", "node_modules/", "vite.config.ts", "postcss.config.cjs"],
  },
];
