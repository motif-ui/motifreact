import type { IconGlobalType } from "../../types";

export type AvatarProps = {
  image?: string;
  icon?: IconGlobalType;
  letters?: string;
} & AvatarDefaultableProps;

export type AvatarDefaultableProps = {
  variant?: "primary" | "secondary" | "danger" | "warning" | "info" | "success";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
};
