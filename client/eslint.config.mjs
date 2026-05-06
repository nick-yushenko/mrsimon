import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import perfectionistPlugin from "eslint-plugin-perfectionist";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import prettierRecommended from "eslint-plugin-prettier/recommended";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    plugins: {
      perfectionist: perfectionistPlugin,
      "unused-imports": unusedImportsPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      "import/default": "off",
      "import/export": "off",
      "import/named": "off",
      "import/namespace": "off",
      "import/newline-after-import": "error",
      "import/no-cycle": [
        "warn",
        {
          allowUnsafeDynamicCyclicDependency: false,
          ignoreExternal: true,
          maxDepth: 3,
        },
      ],
      "import/no-named-as-default": "off",
      "import/no-named-as-default-member": "off",

      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          fixStyle: "separate-type-imports",
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/no-unused-vars": "off",

      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],

      "perfectionist/sort-named-imports": [
        "warn",
        {
          order: "asc",
          type: "line-length",
        },
      ],
      "perfectionist/sort-named-exports": [
        "warn",
        {
          order: "asc",
          type: "line-length",
        },
      ],
      "perfectionist/sort-exports": [
        "warn",
        {
          order: "asc",
          type: "line-length",
        },
      ],
      "perfectionist/sort-imports": [
        "error",
        {
          customGroups: [
            {
              elementNamePattern: "^@mui/.+",
              groupName: "mui",
              modifiers: ["value"],
            },
            {
              elementNamePattern: "^@/app/.+",
              groupName: "app",
              modifiers: ["value"],
            },
            {
              elementNamePattern: "^@/widgets/.+",
              groupName: "widgets",
              modifiers: ["value"],
            },
            {
              elementNamePattern: "^@/features/.+",
              groupName: "features",
              modifiers: ["value"],
            },
            {
              elementNamePattern: "^@/entities/.+",
              groupName: "entities",
              modifiers: ["value"],
            },
            {
              elementNamePattern: "^@/shared/.+",
              groupName: "shared",
              modifiers: ["value"],
            },
          ],
          environment: "node",
          groups: [
            "style",
            "side-effect",
            "type",
            ["builtin", "external"],
            "mui",
            "app",
            "widgets",
            "features",
            "entities",
            "shared",
            "internal",
            ["parent", "sibling", "index"],
            ["type-parent", "type-sibling", "type-index"],
            "unknown",
          ],
          ignoreCase: true,
          internalPattern: ["^@/.+"],
          newlinesBetween: 1,
          order: "asc",
          type: "line-length",
        },
      ],
    },
  },
  prettierRecommended,
]);

export default eslintConfig;
