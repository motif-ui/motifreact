import type { IconGlobalType } from "../../../../../types";
import { InputCommonProps, InputSize } from "../../../../../components/Form/types";
import { InputTextCommonProps } from "../../../../../components/InputText/types";

export type InputPasswordProps = InputTextCommonProps & InputCommonProps & InputPasswordDefaultableProps;

export type InputPasswordDefaultableProps = {
  iconLeft?: IconGlobalType;
  toggleMask?: boolean;
  size?: InputSize;
  pill?: boolean;
  clearable?: boolean;
};
