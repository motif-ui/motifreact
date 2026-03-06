import js from "@eslint/js";
import typescript from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactHooks from "eslint-plugin-react-hooks";
import react from "eslint-plugin-react";
import compat from "eslint-plugin-compat";

export default [
  js.configs.recommended,
  ...typescript.configs.recommendedTypeChecked,
  compat.configs["flat/recommended"],
  {
    files: ["**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"],
    ...typescript.configs.disableTypeChecked,
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    rules: {
      // Eslint rules
      "no-warning-comments": "warn",
      // Typescript rules
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      // React rules
      ...react.configs.recommended.rules,
      "react/no-unescaped-entities": "error",
      "react/display-name": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-boolean-value": "error",
      "react/self-closing-comp": "error",
      "react/jsx-curly-brace-presence": "error",
      // React Hooks rules
      ...reactHooks.configs.recommended.rules,
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "react-hooks/immutability": "off",
      "react-hooks/exhaustive-deps": [
        "warn",
        {
          additionalHooks: "(useDeepCompareEffect|useDeepCompareCallback|useDeepCompareMemo)",
        },
      ],
      // Prettier rules
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
      "prefer-destructuring": [
        "error",
        {
          array: false,
          object: true,
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    ignores: ["node_modules", "dist", "storybook-static", ".next", ".idea", ".vscode", ".git", ".gitlab", ".husky", ".swc"],
  },
  {
    // Configuration specific to TypeScript files
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unnecessary-condition": "error",
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslintPluginPrettierRecommended, // Should be placed last. It applies prettier plugin and its recommended rules.
];
