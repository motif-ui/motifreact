import { InputCommonProps } from "../Form/types";
import { Size4SM } from "../../types";

export type SliderBaseProps = {
  start?: number;
  end?: number;
  min?: number;
  max?: number;
  step?: number;
  inRangeSelector?: boolean;
} & Omit<InputCommonProps, "success" | "error"> &
  SliderDefaultableProps;

export type SliderProps = Omit<SliderBaseProps, "inRangeSelector">;

export type SliderDefaultableProps = {
  variant?: "secondary" | "danger" | "warning" | "primary" | "success";
  fill?: "left" | "right" | "none";
  hideTooltip?: boolean;
  size?: Size4SM;
};
