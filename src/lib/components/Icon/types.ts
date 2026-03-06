import { Size7 } from "../../types";

export type IconProps = {
  iconClass?: string;
  /**
   * <i>Use only if the font library supports ligatures.</i>
   */
  name?: string;
  size?: Size7;
  variant?: "primary" | "secondary" | "info" | "success" | "warning" | "danger";
  className?: string;
  color?: string;
  svgColorType?: "fill" | "stroke";
};
