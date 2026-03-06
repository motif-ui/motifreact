import type { MouseEvent } from "react";
import { Dispatch, SetStateAction, ReactNode } from "react";
import { Size3 } from "../../types";
import { ChipVariant } from "../Chip/types";

type MenuListVariant = "solid" | "underline" | "textOnly";

export type MenuListProps = {
  /**
   * ```
   * {
   *   label: string;
   *   icon: string;
   *   active?: boolean;
   *   disabled?: boolean;
   *   href?: string;
   *   action?: (event: MouseEvent) => void;
   *   targetBlank?: boolean;
   *   chip?: { label: string; variant?: ChipVariant };
   *   items?: SubMenuItemProps[];
   * }
   *
   * SubMenuItemProps: {
   *   label: string;
   *   disabled?: boolean;
   *   href?: string;
   *   action?: (event: MouseEvent) => void;
   *   targetBlank?: boolean;
   *   chip?: { label: string; variant?: ChipVariant };
   *   items?: SubMenuItemProps[];
   * }
   * ```
   */
  items: MainMenuItemProps[];
  logo?: string;
  footerText?: string;
  collapsed?: boolean; // controlled - for controlling from outside
  onCollapsedChange?: (collapsed: boolean) => void;
} & MenuListDefaultableProps;

export type MenuListDefaultableProps = {
  variant?: MenuListVariant;
  darkMode?: boolean;
  enableCollapseButton?: boolean;
  size?: Size3;
  defaultCollapsed?: boolean; // uncontrolled - for the initial state
};

export type SubMenuProps = {
  parentMenuId: string;
  level: number;
  items: SubMenuItemProps[];
  menuItemRenderer: (props: MenuItemCommonProps) => ReactNode;
};

export type MenuListContextProps = {
  variant: MenuListVariant;
  darkMode?: boolean;
  collapsed?: boolean;
  toggle: () => void;
  openSubmenus: string[];
  setOpenSubmenus: Dispatch<SetStateAction<string[]>>;
};

export const menuListContextDefaultValues: MenuListContextProps = {
  variant: "solid",
  toggle: () => {},
  openSubmenus: [],
  setOpenSubmenus: () => {},
};

export type MenuItemCommonProps = {
  label: string;
  icon?: string;
  disabled?: boolean;
  href?: string;
  action?: (event: MouseEvent<HTMLAnchorElement>) => void;
  targetBlank?: boolean;
  items?: SubMenuItemProps[];
  id: string;
  level: number;
  active?: boolean;
  subMenuRenderer?: (props: SubMenuProps) => ReactNode;
  chip?: { label: string; variant?: ChipVariant };
};

export type MainMenuProps = {
  items: MainMenuItemProps[];
  logo?: string;
  footerText?: string;
  enableCollapseButton?: boolean;
  size?: Size3;
};

export type MainMenuItemProps = Omit<MenuItemCommonProps, "level" | "id"> & {
  icon: string;
};

export type SubMenuItemProps = Omit<MenuItemCommonProps, "level" | "icon" | "id">;
