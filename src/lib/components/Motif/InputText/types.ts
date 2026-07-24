import { Dispatch, FocusEventHandler, HTMLAttributes, KeyboardEventHandler, MouseEventHandler, RefObject, SetStateAction } from "react";
import { InputSize, InputValue } from "@/components/Form/types";
import type { IconGlobalType } from "../../../types";

export type InternalInputProps = {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  maxLength?: number;
  size?: InputSize;
  pill?: boolean;
  uncontrolled?: boolean;
  iconLeft?: IconGlobalType;
  iconRight?: IconGlobalType;
  buttonRight?: {
    name: string;
    onClick: () => void;
  };
  disabled?: boolean;
  readOnly?: boolean;
  disableTyping?: boolean;
  numberSpinner?: {
    min?: number;
    max?: number;
    step?: number;
  };
  loader?: boolean;
  success?: boolean;
  error?: boolean;
  onClick?: MouseEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onKeyUp?: KeyboardEventHandler<HTMLInputElement>;
  onChange?: (value?: string) => void;
  onClearClick?: () => void;
  valueTransformer?: (value: string) => string | undefined;
  onValueUpdated?: (value: InputValue) => void;
  type?: "text" | "password";
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  clearable?: boolean;
  imperativeRef?: RefObject<InternalInputHandle | null>;
  textTransform?: TextTransform;
};

export type TextTransform = "uppercase" | "lowercase" | "capitalize";
export type InternalInputHandle = { valueStateSetter: Dispatch<SetStateAction<string>> };
