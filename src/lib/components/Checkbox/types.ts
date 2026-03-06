import { InputCommonProps, InputSize } from "../Form/types";

export type CheckboxProps = {
  label?: string;
  checked?: boolean;
  partialCheck?: boolean;
} & Omit<InputCommonProps, "value"> &
  CheckboxDefaultableProps;

export type CheckboxDefaultableProps = {
  size?: InputSize;
};
