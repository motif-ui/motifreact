/** @type {import('stylelint').Config} */
export default {
  plugins: ["stylelint-no-unsupported-browser-features"],
  extends: ["stylelint-config-standard-scss"],
  rules: {
    "plugin/no-unsupported-browser-features": [
      true,
      {
        severity: "error",
        ignorePartialSupport: true,
        ignore: ["css-when-else", "css-scrollbar", "css3-cursors", "css-resize"],
      },
    ],
    "selector-class-pattern": null,
    "rule-empty-line-before": null,
    "at-rule-empty-line-before": null,
    "declaration-empty-line-before": null,
    "value-keyword-case": null,
    "scss/dollar-variable-empty-line-before": null,
    "color-hex-length": "long",
  },
};
