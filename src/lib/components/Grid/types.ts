import { ReactElement } from "react";
import { RowProps } from "./components/Row";
import { StandardProps, Size7 } from "../../types";

/**
 * GridSpacing is a spacing token, or spacing tokens per breakpoint. Breakpoints work mobile-first: each breakpoint
 * applies to its width and above, so a breakpoint without a value takes the value of the closest smaller breakpoint.
 *
 * @example
 * gap="md"
 * gap={{ base: "sm", lgUp: "xl" }}
 */
type GridSpacingSize = Size7 | "none";
export type GridSpacing = GridSpacingSize | Partial<Record<"base" | "xsUp" | "smUp" | "mdUp" | "lgUp" | "xlUp" | "xxlUp", GridSpacingSize>>;

export type GapProps = {
  /** Space between cols, both horizontally and vertically */
  gap?: GridSpacing;
  /** Vertical space between cols wrapped onto a new line. Takes precedence over gap */
  rowGap?: GridSpacing;
  /** Horizontal space between side by side cols. Takes precedence over gap */
  columnGap?: GridSpacing;
};

export type GridProps = {
  colProps?: StandardProps;
  children: ReactElement<RowProps> | (ReactElement<RowProps> | null | boolean)[] | null | boolean;
} & GridDefaultableProps;

export type GridDefaultableProps = {
  fluid?: boolean;
  // TODO: Remove in the next major version, together with gutter, and make "none" the default padding. Then render no
  //  padding class when padding is not given, and keep "none" only for turning it off in responsive values and for gap
  //  consistency, e.g. padding={{ base: "xl", lgUp: "none" }}
  /** @deprecated Use padding="none" instead. The default padding will be "none" in the next major version. */
  leanToEdge?: boolean;
  /**
   * @deprecated Use gap and padding instead, e.g. gutter="lg" is equal to gap="lg" padding="lg". gap, rowGap, columnGap
   * and padding take precedence over gutter
   */
  gutter?: Size7;
  /** Padding of the Grid, on all sides */
  padding?: GridSpacing;
} & GapProps;
