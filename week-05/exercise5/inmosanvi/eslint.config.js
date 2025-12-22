import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
		ignores: ["dist", "node_modules", "public"] // Ignore build and dependency directories
	},
	{
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
		rules: {
			"camelcase": "error", // Enforce camelCase naming convention
			"curly": "error", // Require curly braces for all control statements
			"eqeqeq": "error", // Require the use of === and !==
		}
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.browser },
  },
]);
