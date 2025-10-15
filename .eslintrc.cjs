module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: false },
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
  ],
  plugins: ["vue", "@typescript-eslint", "simple-import-sort"],
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
    "@typescript-eslint/no-explicit-any": "off",
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
  overrides: [
    {
      files: ["*.vue"],
      rules: {
        "max-lines": "off",
      },
    },
  ],
  ignorePatterns: ["dist/", "node_modules/", "vite.config.ts", "postcss.config.cjs"],
};
