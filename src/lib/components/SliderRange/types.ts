import { InputCommonProps } from "../Form/types";
import { Size4SM, Variant } from "../../types";

export type SliderRangeProps = {
  start?: number;
  end?: number;
  min?: number;
  max?: number;
} & Omit<InputCommonProps, "success" | "error"> &
  SliderRangeDefaultableProps;

export type SliderRangeDefaultableProps = {
  step?: number;
  variant?: Variant;
  hideTooltip?: boolean;
  size?: Size4SM;
};
