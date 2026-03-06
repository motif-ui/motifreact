import { ReactElement } from "react";
import { InputCommonProps, InputSize } from "../Form/types";
import { RadioProps } from "../Radio/types";

export type RadioGroupProps = {
  children: (ReactElement<RadioProps> | null | boolean)[];
} & Omit<InputCommonProps, "name"> & { name: string } & RadioGroupDefaultableProps;

export type RadioGroupContextProps = {
  name?: string;
  selectedValue?: string;
  setSelectedValue?: (id: string) => void;
  onGroupChange?: (value: string) => void;
  disabled?: boolean;
  success?: boolean;
  readOnly?: boolean;
  error?: boolean;
  size?: InputSize;
};

export type RadioGroupDefaultableProps = {
  orientation?: "vertical" | "horizontal";
  size?: InputSize;
};
