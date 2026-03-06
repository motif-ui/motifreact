import type { MouseEvent } from "react";

export type ButtonProps = {
  label?: string;
  icon?: string;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  htmlType?: "submit" | "button";
} & ButtonDefaultableProps;

export type ButtonDefaultableProps = {
  shape?: "solid" | "outline" | "textonly";
  variant?: "primary" | "secondary" | "info" | "success" | "warning" | "danger";
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
  pill?: boolean;
  fluid?: boolean;
};
