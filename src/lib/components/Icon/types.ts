import { Size8LG, Variant } from "../../types";

export type IconProps = {
  iconClass?: string;
  /**
   * <i>Use only if the font library supports ligatures.</i>
   */
  name?: string;
  size?: Size8LG;
  variant?: Variant;
  className?: string;
  color?: string;
  svgColorType?: "fill" | "stroke";
};
