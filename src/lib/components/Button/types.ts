import type { IconGlobalType } from "../../types";
import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";

export type ButtonProps = {
  ref?: Ref<HTMLButtonElement>;
  label?: ReactNode;
  children?: ReactNode;
  icon?: IconGlobalType;
  iconPosition?: "left" | "right";
  htmlType?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> &
  ButtonDefaultableProps;

export type ButtonDefaultableProps = {
  shape?: "solid" | "outline" | "textonly";
  variant?: "primary" | "secondary" | "info" | "success" | "warning" | "danger";
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
  pill?: boolean;
  fluid?: boolean;
};
