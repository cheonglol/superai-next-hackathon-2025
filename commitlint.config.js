export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "header-max-length": [2, "always", 400], // Maximum header length
    "type-enum": [
      // Basic commit types for hackathon
      2,
      "always",
      ["feat", "fix", "chore", "docs", "refact"],
    ],
    "type-case": [0, "always"], // Disable case enforcement for type
    "type-empty": [0, "never"], // Make type optional
    "subject-full-stop": [
      // Disallow full stop at the end of the subject
      2,
      "never",
      ".",
    ],
    "subject-case": [0, "never"], // Ignore case sensitivity in subject
    "body-max-line-length": [
      // Maximum line length for the body
      2,
      "always",
      200,
    ],
    "footer-max-line-length": [
      // Maximum line length for the footer
      2,
      "always",
      100,
    ],
  },
};
