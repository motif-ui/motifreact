import { ReactElement } from "react";
import { InputCommonProps, InputSize } from "../Form/types";

export type PinCodeProps = {
  children: ReactElement<PinCodeItemProps>[];
} & InputCommonProps &
  PinCodeDefaultableProps;

export type PinCodeItemProps = {
  space?: boolean;
  masked?: boolean;
  disabled?: boolean;
};

export type PinCodeItemHOCProps = {
  index: number;
  indexByWord: number;
  value: string;
} & PinCodeItemProps;

export type PinCodeContextValueProps = {
  size: InputSize;
  circle?: boolean;
  letterCase?: "upper" | "lower";
  maskType: "asterisks" | "number";
  error?: boolean;
  success?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  focusNextInput: (index: number) => void;
  focusPreviousInput: (index: number, value: string) => void;
  onChange: (index: number, value?: string) => void;
};

export const PinCodeContextDefaultValues: PinCodeContextValueProps = {
  size: "md",
  maskType: "asterisks",
  focusNextInput: () => {},
  focusPreviousInput: () => {},
  onChange: () => {},
};

export type PinCodeDefaultableProps = {
  size?: InputSize;
  circle?: boolean;
  letterCase?: "upper" | "lower";
  maskType?: "asterisks" | "number";
};
