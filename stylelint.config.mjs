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
    "custom-property-empty-line-before": null,
    // Fixed sizing ignores the space seed, so spacing properties must use the spacing scale. The 1px hairline (sizing-0/1) has no spacing step
    "declaration-property-value-disallowed-list": [
      {
        "/^(padding|margin|gap|row-gap|column-gap|inset|top|right|bottom|left|scroll-padding|scroll-margin)/": [
          "/--mtf-sizing-(?!(0|1)\\b)\\d/",
        ],
      },
      {
        message: "Use --mtf-sizing-space-N for spacing (N = px in the default theme): fixed --mtf-sizing-N does not follow the space seed",
      },
    ],
    "selector-max-id": 0,
  },
  // CSS rules (docs/review/css.md) for components migrated to the design tokens; add each component here as it migrates.
  // Once every component has migrated, these rules move to the top-level rules and the list goes away.
  overrides: [
    {
      files: ["src/lib/components/Select/**/*.scss", "src/lib/components/ProgressCircle/**/*.scss"],
      rules: {
        "declaration-no-important": true,
        "selector-no-qualifying-type": true,
        "selector-max-specificity": "0,3,0",
        "selector-max-compound-selectors": 3,
      },
    },
  ],
};
