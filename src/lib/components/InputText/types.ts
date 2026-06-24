import { FocusEventHandler, MouseEventHandler } from "react";
import { InputCommonProps, InputSize } from "../Form/types";
import { IconGlobalType } from "src/lib/types.ts";

export type InputTextDefaultableProps = {
  pill?: boolean;
  size?: InputSize;
  clearable?: boolean;
};

export type InputTextProps = {
  placeholder?: string;
  iconLeft?: IconGlobalType;
  iconRight?: IconGlobalType;
  maxLength?: number;
  onClick?: MouseEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  type?: "text" | "number";
} & InputCommonProps &
  InputTextDefaultableProps;
