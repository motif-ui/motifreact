import { FocusEventHandler, MouseEventHandler, ReactElement } from "react";
import { InputCommonProps, InputSize } from "../Form/types";

export type InputTextDefaultableProps = {
  pill?: boolean;
  size?: InputSize;
};

export type InputTextProps = {
  placeholder?: string;
  iconLeft?: string | ReactElement;
  iconRight?: string | ReactElement;
  maxLength?: number;
  onClick?: MouseEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  type?: "text" | "number";
} & InputCommonProps &
  InputTextDefaultableProps;
