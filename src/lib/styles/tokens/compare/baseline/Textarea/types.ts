import { InputCommonProps, InputSize } from "../../../../../components/Form/types";

export type TextareaProps = {
  placeholder?: string;
} & InputCommonProps &
  TextareaDefaultableProps;

export type TextareaDefaultableProps = {
  size?: InputSize;
  maxLength?: number;
  rows?: number;
};
