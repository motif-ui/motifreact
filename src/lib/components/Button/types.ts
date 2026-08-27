import type { IconGlobalType, Variant } from "../../types";
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
  variant?: Variant;
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
  pill?: boolean;
  fluid?: boolean;
};
