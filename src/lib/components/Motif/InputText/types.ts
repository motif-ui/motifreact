import { Dispatch, FocusEventHandler, KeyboardEventHandler, MouseEventHandler, ReactElement, RefObject, SetStateAction } from "react";
import { InputSize, InputValue } from "@/components/Form/types";

export type InternalInputProps = {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  maxLength?: number;
  size?: InputSize;
  pill?: boolean;
  uncontrolled?: boolean;
  iconLeft?: string | ReactElement;
  iconRight?: string | ReactElement;
  buttonRight?: {
    name: string;
    onClick: () => void;
  };
  disabled?: boolean;
  readOnly?: boolean;
  disableTyping?: boolean;
  success?: boolean;
  error?: boolean;
  onClick?: MouseEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onKeyUp?: KeyboardEventHandler<HTMLInputElement>;
  onChange?: (value?: string) => void;
  onClearClick?: () => void;
  onValueUpdated?: (value: InputValue) => void;
  type?: "text" | "password" | "number";
  clearable?: boolean;
  imperativeRef?: RefObject<InternalInputHandle | null>;
};

export type InternalInputHandle = { valueStateSetter: Dispatch<SetStateAction<string>> };
