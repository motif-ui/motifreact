import { FocusEventHandler, MouseEventHandler, ReactNode } from "react";
import { InputCommonProps, InputSize } from "../Form/types";

export type InputTextDefaultableProps = {
  pill?: boolean;
  size?: InputSize;
};

export type InputTextProps = {
  placeholder?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  maxLength?: number;
  onClick?: MouseEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  readOnlyWithEnabledLook?: boolean;
} & InputCommonProps &
  InputTextDefaultableProps;
