import { InputCommonProps } from "../Form/types";
import { Size4SM } from "../../types";

export type SliderRangeProps = {
  start?: number;
  end?: number;
  min?: number;
  max?: number;
} & Omit<InputCommonProps, "success" | "error"> &
  SliderRangeDefaultableProps;

export type SliderRangeDefaultableProps = {
  step?: number;
  variant?: "secondary" | "danger" | "warning" | "primary" | "success";
  hideTooltip?: boolean;
  size?: Size4SM;
};
