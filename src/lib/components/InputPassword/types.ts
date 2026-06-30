import type { IconGlobalType } from "../../types";
import { InputCommonProps, InputSize } from "../Form/types";
import { InputTextCommonProps } from "@/components/InputText/types.ts";

export type InputPasswordProps = InputTextCommonProps & InputCommonProps & InputPasswordDefaultableProps;

export type InputPasswordDefaultableProps = {
  iconLeft?: IconGlobalType;
  toggleMask?: boolean;
  size?: InputSize;
  pill?: boolean;
  clearable?: boolean;
};
