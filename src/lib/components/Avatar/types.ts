import type { IconGlobalType, Variants } from "../../types";

export type AvatarProps = {
  image?: string;
  icon?: IconGlobalType;
  letters?: string;
} & AvatarDefaultableProps;

export type AvatarDefaultableProps = {
  variant?: Variants;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
};
