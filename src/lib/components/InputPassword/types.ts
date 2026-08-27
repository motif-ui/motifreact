import type { IconGlobalType } from "../../types";
import { InputCommonProps, InputSize } from "../Form/types";
import { InputTextCommonProps } from "../InputText/types";

export type InputPasswordProps = InputTextCommonProps & InputCommonProps & InputPasswordDefaultableProps;

export type InputPasswordDefaultableProps = {
  iconLeft?: IconGlobalType;
  toggleMask?: boolean;
  size?: InputSize;
  pill?: boolean;
  clearable?: boolean;
};
