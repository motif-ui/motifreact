import type { MouseEvent, ReactElement } from "react";
import type { IconGlobalType, Variant } from "../../types";
import { ButtonProps } from "../Button/types";
import { LinkProps } from "../Link/types";
import { IconButtonProps } from "../IconButton/types";
import type { DropdownMenuItemProps } from "../Dropdown/types";

/** The icon button at the top right: runs onClick, or opens a dropdown menu with the items of Dropdown */
export type CardHeaderAction = { icon: IconGlobalType } & (
  { onClick: (event: MouseEvent<HTMLButtonElement>) => void; items?: never } | { items: DropdownMenuItemProps[]; onClick?: never }
);

export type CardActionButtonPosition = "left" | "center" | "right" | "spaceBetween" | "stretch";

export type CardProps = {
  title?: string;
  subtitle?: string;
  avatarText?: string;
  icon?: IconGlobalType;
  iconVariant?: Variant;
  avatarIcon?: IconGlobalType;
  image?: string;
  action?: CardHeaderAction;
  contentTitle?: string;
  contentSubtitle?: string;
  contentText?: string;
  contentImage?: string;
  contentLink?: { text: string; href: string; targetBlank?: boolean };
  contentActionButton?: { text: string; onClick: (event: MouseEvent<HTMLButtonElement>) => void };
  contentAlternateButton?: { text: string; onClick: (event: MouseEvent<HTMLButtonElement>) => void };
  contentActionLink?: { text: string; href: string; icon?: IconGlobalType; targetBlank?: boolean };
  buttons?: ReactElement<ButtonProps | LinkProps | IconButtonProps>[];
  buttonsPosition?: CardActionButtonPosition;
} & CardDefaultableProps;

export type CardDefaultableProps = {
  outlined?: boolean;
  elevated?: boolean;
  variant?: CardVariant;
  imagePosition?: "left" | "right";
};

export type CardVariant = "neutral" | Variant;
