import { InputCommonProps, InputSize } from "../../../../../components/Form/types";

export type RadioProps = {
  label?: string;
  checked?: boolean;
} & Omit<InputCommonProps, "value"> & { value: string } & RadioDefaultableProps;

export type RadioDefaultableProps = {
  size?: InputSize;
};
