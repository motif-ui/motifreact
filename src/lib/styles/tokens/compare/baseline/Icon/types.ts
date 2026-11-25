import { Size10LG, Variant } from "../../../../../types";

export type IconProps = {
  iconClass?: string;
  /**
   * <i>Use only if the font library supports ligatures.</i>
   */
  name?: string;
  size?: Size10LG;
  variant?: Variant;
  className?: string;
  color?: string;
  svgColorType?: "fill" | "stroke";
};
