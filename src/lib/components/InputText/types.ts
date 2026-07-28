import { FocusEventHandler, MouseEventHandler } from "react";
import { InputCommonProps, InputSize } from "../Form/types";
import { IconGlobalType } from "src/lib/types.ts";

export type InputTextDefaultableProps = {
  pill?: boolean;
  size?: InputSize;
  clearable?: boolean;
  textTransform?: "uppercase" | "lowercase" | "capitalize";
};

export type InputTextProps = InputTextCommonProps & InputCommonProps & InputTextDefaultableProps;

export type InputTextCommonProps = {
  placeholder?: string;
  pill?: boolean;
  clearable?: boolean;
  iconLeft?: IconGlobalType;
  iconRight?: IconGlobalType;
  maxLength?: number;
  onClick?: MouseEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
};
