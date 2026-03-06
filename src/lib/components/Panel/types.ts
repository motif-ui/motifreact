import { Size3 } from "../../types";

export type PanelProps = {
  title?: string;
  titleIcon?: string;
} & PanelDefaultableProps;

export type PanelDefaultableProps = {
  type?: "default" | "solid" | "elevated";
  bordered?: boolean;
  titleSize?: Size3;
  /**
   * ```
   * Single or space separated values from:
   *
   * "all", "top", "right", "bottom", "left"
   * ```
   */
  lean?: string;
};
