// Old theme variable → new token. Components that are not migrated yet keep the old name but get the new value.
// Names without a counterpart are left out on purpose: they keep their old value until their component migrates.

const SIZES = [
  1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 38, 40, 44, 48, 52, 56, 64, 72, 80, 96, 120, 128, 160, 176, 190, 216, 256,
  266, 320, 342, 360, 400, 418, 480, 512, 720, 960,
];

// Old "base" text family is size × weight; the new scale splits it into a role (size + line height) and a weight
const BASE_ROLES = { xxs: "label-xs", xs: "label-sm", sm: "label-md", md: "label-lg", lg: "label-xl", xl: "heading-h5" };
const BASE_WEIGHTS = { 500: "strong", 600: "stronger", 700: "strongest" };
const BODY_SIZES = ["xxs", "xs", "sm", "md", "lg"];

const COLORS = {
  "border-danger-default": "danger-border",
  "border-success-default": "success-border",
  "border-primary-default": "primary-border",
  "border-light-default": "border-default",
  "border-light-disabled": "border-disabled",
  "surface-base-base1": "surface-disabled",
  "surface-base-base4": "neutral-soft",
  "surface-base-bg-light": "surface-default",
  "surface-base-global-light": "surface-default",
  "surface-light-default": "neutral-soft",
  "text-base-caption": "text-softer",
  "text-base-caption-light": "text-softer",
  "text-base-disabled": "text-disabled",
  "text-base-disabled-light": "text-disabled",
  "text-base-subtitle": "text-soft",
  "text-base-text-dark": "text-stronger",
  "text-base-title": "text-strong",
  "text-light-disabled": "text-disabled",
  "text-primary-default": "primary-text",
};

export const LEGACY_MAP = {
  ...Object.fromEntries(Object.entries(COLORS).map(([old, next]) => [`--theme-color-${old}`, `--mtf-color-${next}`])),
  ...Object.fromEntries(SIZES.map(size => [`--base-sizing-${size}x`, `--mtf-sizing-${size}`])),
  "--theme-sizing-radius-default": "--mtf-sizing-radius-md",
  "--theme-sizing-radius-round": "--mtf-sizing-radius-round",
  "--base-radius-xs": "--mtf-sizing-radius-sm",
  "--base-radius-sm": "--mtf-sizing-radius-md",
  "--base-radius-md": "--mtf-sizing-radius-lg",
  "--base-radius-pill": "--mtf-sizing-radius-round",
  ...Object.fromEntries(
    BODY_SIZES.flatMap(size =>
      ["font-size", "line-height", "font-weight"].map(property => [
        `--typography-body-${size}-${property}`,
        `--mtf-typography-body-${size}-${property}`,
      ]),
    ),
  ),
  ...Object.fromEntries(
    Object.entries(BASE_ROLES).flatMap(([size, role]) =>
      Object.entries(BASE_WEIGHTS).flatMap(([weight, name]) => [
        [`--typography-base-${size}-${weight}-font-size`, `--mtf-typography-${role}-font-size`],
        [`--typography-base-${size}-${weight}-line-height`, `--mtf-typography-${role}-line-height`],
        [`--typography-base-${size}-${weight}-font-weight`, `--mtf-typography-weight-${name}`],
      ]),
    ),
  ),
};

/** CSS block that points every mapped old name at its new token, under the given selector. */
export const legacyCss = (selector: string) =>
  [`${selector} {`, ...Object.entries(LEGACY_MAP).map(([old, next]) => `  ${old}: var(${next});`), "}"].join("\n");
