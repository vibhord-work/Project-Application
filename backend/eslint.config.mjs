import globals from "globals";

export default [
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**", "coverage/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: globals.node
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "warn"
    }
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      sourceType: "module"
    }
  }
];
