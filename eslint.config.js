import js from "@eslint/js";
import ts from "typescript-eslint";

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    rules: {
      "no-console": ["warn", { allow: ["error"] }],
      "@typescript-eslint/no-explicit-any": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name='fetch'][arguments.length<1]",
          message: "Use lib/http.ts wrapper for fetch."
        }
      ]
    },
    ignores: ["node_modules", ".next", "dist"]
  }
];


