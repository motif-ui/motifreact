import type { IconGlobalType } from "../../types";
import { InputCommonProps, InputSize } from "../Form/types";
import { InputTextCommonProps } from "@/components/InputText/types.ts";

export type InputNumberProps = {
  value?: number;
  onChange?: (value?: number) => void;
  min?: number;
  max?: number;
} & Omit<InputCommonProps, "value" | "onChange"> &
  Omit<InputTextCommonProps, "pill" | "clearable" | "iconLeft" | "iconRight"> &
  InputNumberDefaultableProps;

export type InputNumberDefaultableProps = {
  size?: InputSize;
  pill?: boolean;
  clearable?: boolean;
  iconLeft?: IconGlobalType;
  iconRight?: IconGlobalType;
  removeSpinner?: boolean;
  allowDecimals?: boolean;
  allowNegative?: boolean;
  decimalScale?: number;
  step?: number;
};
