import type { MouseEvent } from "react";

export type BusinessCardProps = {
  title?: string;
  description?: string;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  link?: {
    text?: string;
    href: string;
    targetBlank?: boolean;
  };
  iconButton?: {
    icon: string;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  };
  image?: string;
  icon?: string;
} & BusinessCardDefaultableProps;

export type BusinessCardDefaultableProps = {
  solid?: boolean;
  elevated?: boolean;
  outline?: boolean;
  position?: "left" | "right" | "center";
  variant?: "neutral" | "primary" | "secondary" | "info" | "success" | "warning" | "danger";
};
