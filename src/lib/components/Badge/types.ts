import type { IconGlobalType } from "../../types";

export type BadgeProps = {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  content?: string;
  icon?: IconGlobalType;
  dot?: boolean;
} & BadgeDefaultableProps;

export type BadgeDefaultableProps = {
  max?: number;
  align?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};
