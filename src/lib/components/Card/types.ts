import type { MouseEvent, ReactElement } from "react";
import { ButtonProps } from "../Button/types";
import { LinkProps } from "../Link/types";
import { IconButtonProps } from "../IconButton/types";

export type CardProps = {
  title?: string;
  subtitle?: string;
  avatarText?: string;
  icon?: string;
  image?: string;
  action?: { icon: string; onClick: (event: MouseEvent<HTMLButtonElement>) => void };
  contentTitle?: string;
  contentSubtitle?: string;
  contentText?: string;
  contentImage?: string;
  contentLink?: { text: string; href: string; targetBlank?: boolean };
  contentActionButton?: { text: string; onClick: (event: MouseEvent<HTMLButtonElement>) => void };
  contentAlternateButton?: { text: string; onClick: (event: MouseEvent<HTMLButtonElement>) => void };
  contentActionLink?: { text: string; href: string; icon?: string; targetBlank?: boolean };
  buttons?: ReactElement<ButtonProps | LinkProps | IconButtonProps>[];
} & CardDefaultableProps;

export type CardDefaultableProps = {
  outlined?: boolean;
  elevated?: boolean;
  variant?: "primary" | "secondary" | "info" | "success" | "warning" | "danger";
  imagePosition?: "left" | "right";
};
