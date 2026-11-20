import { InputCommonProps, InputSize } from "@/components/Form/types";

export type SwitchProps = {
  label?: string;
  checked?: boolean;
} & Omit<InputCommonProps, "value" | "error" | "success"> &
  SwitchDefaultableProps;

export type SwitchDefaultableProps = {
  size?: InputSize;
};
