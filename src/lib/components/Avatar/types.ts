export type AvatarProps = {
  image?: string;
  icon?: string;
  letters?: string;
} & AvatarDefaultableProps;

export type AvatarDefaultableProps = {
  variant?: "primary" | "secondary" | "danger" | "warning" | "info" | "success";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
};
