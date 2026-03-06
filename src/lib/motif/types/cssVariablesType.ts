/**
 * COLORS
 */
export type ColorSurface = {
  primary?: ExtendedColorStateVariations;
  secondary?: Partial<ColorStateVariations & { negative?: string }>;
  info?: ExtendedColorStateVariations;
  danger?: ExtendedColorStateVariations;
  success?: ExtendedColorStateVariations;
  warning?: ExtendedColorStateVariations;
  light?: ExtendedColorStateVariations;
  base?: {
    bgLight?: string;
    bgDark?: string;
    base1?: string;
    base2?: string;
    base3?: string;
    base4?: string;
    base5?: string;
    base6?: string;
    base7?: string;
    base8?: string;
    globalLight?: string;
    lightOverlay50?: string;
    lightOverlay75?: string;
    lightOverlay90?: string;
    lightOverlay25?: string;
    darkOverlay15?: string;
    darkOverlay50?: string;
  };
};

export type ColorBorder = {
  light?: ColorStateVariations;
  primary?: ColorStateVariations & { focus?: string };
  secondary?: ColorStateVariations;
  info?: ColorStateVariations;
  danger?: ColorStateVariations;
  success?: ColorStateVariations;
  warning?: ColorStateVariations;
};

export type ColorText = {
  base?: {
    textDark?: string;
    textLight?: string;
    title?: string;
    titleLight?: string;
    subtitle?: string;
    subtitleLight?: string;
    caption?: string;
    captionLight?: string;
    disabled?: string;
    disabledLight?: string;
    globalDark?: string;
    globalLight?: string;
    darkOverlay25?: string;
    darkOverlay40?: string;
    darkOverlay50?: string;
    darkOverlay75?: string;
    lightOverlay50?: string;
    lightOverlay75?: string;
    lightOverlay90?: string;
    defaultOverlay50?: string;
  };
  primary?: ColorStateVariations & { opposite?: string };
  secondary?: ColorStateVariations;
  light?: ColorStateVariations;
  info?: ColorStateVariations;
  danger?: ColorStateVariations;
  success?: ColorStateVariations;
  warning?: ColorStateVariations;
};

export type ColorSemantic = {
  primary?: ColorScale<"primary">;
  secondary?: ColorScale<"secondary">;
  neutral?: ColorScale<"neutral">;
  accent?: ColorScale<"accent">;
  info?: ColorScale<"info">;
  success?: ColorScale<"success">;
  warning?: ColorScale<"warning">;
  danger?: ColorScale<"danger">;
  flag?: ColorScale<"flag">;
  grayscale?: ColorScale<"grayscale">;
  base?: ColorScale<"base">;
};

/**
 * TYPOGRAPHY
 */

export type Typography = {
  fontFamily?: string;
  heading?: { [K in `heading${1 | 2 | 3 | 4 | 5 | 6}`]?: TypographyStyle }; // heading1, heading2, ...
  display?: { [K in `${"lg" | "md" | "sm"}`]?: TypographyStyle }; // lg, md, ...
  body?: { [K in `${"lg" | "md" | "sm" | "xs" | "xxs"}`]?: TypographyStyle }; // lg, md, ...
  base?: { [K in "xl" | "lg" | "md" | "sm" | "xs" | "xxs"]?: { [J in `${K}-${500 | 600 | 700}`]?: TypographyStyle } };
};

/**
 * SIZING AND SPACING
 */
export type Sizing = {
  radius?: {
    default?: string;
    round?: string;
  };
  limit?: {
    inputMinWidth?: string;
  };
};

/**
 * ELEVATION AND SHADOW
 */
export type Elevation = { [K in `elevation${1 | 2 | 3 | 4 | 5 | 6}`]?: ElevationStyle } & {
  focusring?: ElevationStyle;
  focusringWhite?: ElevationStyle;
};

/**
 * GRID SYSTEM
 */
export type Grid = {
  gutter?: { gutter?: string };
  breakpoint?: GridBreakpoint;
  container?: GridBreakpoint;
};

/**
 * Helping types
 */
type ColorScale<T extends string> = { [K in `${T}-${50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900}`]?: string };

type ElevationStyle = {
  x?: string;
  y?: string;
  blur?: string;
  spread?: string;
  shadow?: string;
};

type GridBreakpoint = {
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
};

type ColorStateVariations = {
  default?: string;
  hover?: string;
  active?: string;
  disabled?: string;
};

type ExtendedColorStateVariations = ColorStateVariations & {
  negative?: string;
  inverse?: string;
};

type TypographyStyle = {
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string | number;
  fontStyle?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textDecoration?: string;
  textCase?: string;
};
