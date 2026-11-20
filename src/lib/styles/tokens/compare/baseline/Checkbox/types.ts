import { InputCommonProps, InputSize } from "@/components/Form/types";

export type CheckboxProps = {
  label?: string;
  checked?: boolean;
  partialCheck?: boolean;
} & Omit<InputCommonProps, "value"> &
  CheckboxDefaultableProps;

export type CheckboxDefaultableProps = {
  size?: InputSize;
};
