import type { IconGlobalType } from "../../types";
import { InputCommonProps, InputSize } from "../Form/types";

export type InputPasswordProps = {
  placeholder?: string;
} & InputCommonProps &
  InputPasswordDefaultableProps;

export type InputPasswordDefaultableProps = {
  icon?: IconGlobalType;
  toggleMask?: boolean;
  size?: InputSize;
  pill?: boolean;
};
