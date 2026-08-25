import { Size7, Variants } from "../../types";

export type IconProps = {
  iconClass?: string;
  /**
   * <i>Use only if the font library supports ligatures.</i>
   */
  name?: string;
  size?: Size7;
  variant?: Variants;
  className?: string;
  color?: string;
  svgColorType?: "fill" | "stroke";
};
