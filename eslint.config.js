import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysIncludeTypes: true,
          project: "./tsconfig.app.json",
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "import/no-unresolved": "error",
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          ts: "never",
          tsx: "never",
          js: "never",
          jsx: "never",
        },
      ],
      // Enforce using path aliases instead of relative imports from src
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["src/*"],
              message: "Use path aliases (e.g., @/hooks/...) instead of 'src/...' imports",
            },
          ],
        },
      ],
    },
  }
);
