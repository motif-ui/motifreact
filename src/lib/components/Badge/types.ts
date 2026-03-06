export type BadgeProps = {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  content?: string;
  icon?: string;
  dot?: boolean;
} & BadgeDefaultableProps;

export type BadgeDefaultableProps = {
  max?: number;
  align?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};
