import { ReactElement } from "react";
import { RowProps } from "./components/Row";
import { StandardProps, Size7 } from "../../../../../types";

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
  /**
   * @deprecated Grid will be fluid by default in the next major version. Use Container for the container max-widths of
   * a page. In a Container, a Col or a Panel, fluid has no effect and can be removed already
   */
  fluid?: boolean;
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
