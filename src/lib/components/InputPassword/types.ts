import type { IconGlobalType } from "../../types";
import { InputCommonProps, InputSize } from "../Form/types";

export type InputPasswordProps = {
  placeholder?: string;
  icon?: IconGlobalType;
} & InputCommonProps &
  InputPasswordDefaultableProps;

export type InputPasswordDefaultableProps = {
  toggleMask?: boolean;
  size?: InputSize;
  pill?: boolean;
};
