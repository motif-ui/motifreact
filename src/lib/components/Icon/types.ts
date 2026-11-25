import { Size10LG, VariantV2 } from "../../types";

export type IconProps = {
  iconClass?: string;
  /**
   * <i>Use only if the font library supports ligatures.</i>
   */
  name?: string;
  size?: Size10LG;
  variant?: VariantV2;
  className?: string;
  color?: string;
  svgColorType?: "fill" | "stroke";
};
