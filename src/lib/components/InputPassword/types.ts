import { InputCommonProps, InputSize } from "../Form/types";

export type InputPasswordProps = {
  placeholder?: string;
  icon?: string;
} & InputCommonProps &
  InputPasswordDefaultableProps;

export type InputPasswordDefaultableProps = {
  toggleMask?: boolean;
  size?: InputSize;
  pill?: boolean;
};
