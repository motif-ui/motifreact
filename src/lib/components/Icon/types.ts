import { Size7, VariantV2 } from "../../types";

export type IconProps = {
  iconClass?: string;
  /**
   * <i>Use only if the font library supports ligatures.</i>
   */
  name?: string;
  size?: Size7;
  variant?: VariantV2;
  className?: string;
  color?: string;
  svgColorType?: "fill" | "stroke";
};
