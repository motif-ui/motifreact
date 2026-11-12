import type { IconGlobalType, Size5, VariantV2 } from "../../types";
import type { MouseEvent } from "react";

export type ButtonProps = {
  label?: string;
  icon?: IconGlobalType;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  htmlType?: "submit" | "button";
} & ButtonDefaultableProps;

export type ButtonDefaultableProps = {
  shape?: "solid" | "outline" | "textonly";
  variant?: VariantV2;
  size?: "xxs" | Size5;
  pill?: boolean;
  fluid?: boolean;
};
