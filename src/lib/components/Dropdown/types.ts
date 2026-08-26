import type { IconGlobalType } from "../../types";
import type { MouseEvent } from "react";
import { Size4SM, Variants } from "../../types";

export type Spacing = "withGap" | "callout" | "noSpace";

export type DropdownProps = {
  label?: string;
  icon?: IconGlobalType;
  disabled?: boolean;
  /**
   * ```
   * {
   *   label?: string;
   *   icon?: IconGlobalType;
   *   iconColor?: string;
   *   header?: string;
   *   action?: (event: MouseEvent) => void;
   *   disabled?: boolean;
   * }[]
   * ```
   */
  items: DropdownMenuItemProps[];
} & DropdownDefaultableProps;

export type DropdownDefaultableProps = {
  shape?: "solid" | "textOnly";
  variant?: Variants;
  size?: Size4SM;
  pill?: boolean;
  spacing?: Spacing;
};

export type DropdownMenuItemProps = {
  label?: string;
  icon?: IconGlobalType;
  iconColor?: string;
  header?: string;
  action?: (event: MouseEvent<HTMLAnchorElement>) => void;
  disabled?: boolean;
};

export type DropdownContextProps = {
  open: boolean;
  toggleMenu?: () => void;
  size: Size4SM;
  disabled: boolean;
  hideMenu: () => void;
};

export const dropdownContextDefaultValues: DropdownContextProps = {
  open: false,
  toggleMenu: () => {},
  size: "md",
  disabled: false,
  hideMenu: () => {},
};
