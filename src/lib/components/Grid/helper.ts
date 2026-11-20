import { Size7 } from "../../types";
import { GapProps, GridSpacing } from "./types";

/**
 * Converts a spacing prop to module class names, named as {prefix}-{size} for base and {prefix}-{breakpoint}-{size} for
 * the others, e.g. ("gap", { base: "sm", lgUp: "xl" }) => ["gap-sm", "gap-lg-xl"]. When given, base is used as the base
 * value if the spacing has none, e.g. ("gap", { lgUp: "xl" }, "sm") => ["gap-sm", "gap-lg-xl"].
 */
export const getSpacingClasses = (prefix: string, spacing: GridSpacing | undefined, base?: Size7) => {
  // A single value already applies to all breakpoints
  if (typeof spacing === "string") return [`${prefix}-${spacing}`];
  return Object.entries({ base, ...spacing })
    .filter(([, value]) => !!value)
    .map(([breakpoint, value]) =>
      // Class names and CSS variables use the plain breakpoint names, e.g. lgUp => gap-lg-xl, --mtf-grid-lg-gap
      breakpoint === "base" ? `${prefix}-${value}` : `${prefix}-${breakpoint.replace(/Up$/, "")}-${value}`,
    );
};

/**
 * Converts gap props to module class names. Each class sets the related public CSS variable (--mtf-grid-{breakpoint}-gap
 * etc.) on the element. When given, base is used as the base value of gap only, since rowGap and columnGap fall back to
 * gap anyway.
 */
export const getGapClasses = ({ gap, rowGap, columnGap }: GapProps, base?: Size7) => [
  ...getSpacingClasses("gap", gap, base),
  ...getSpacingClasses("row-gap", rowGap),
  ...getSpacingClasses("column-gap", columnGap),
];
