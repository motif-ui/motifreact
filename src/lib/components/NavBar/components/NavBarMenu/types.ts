import type { MouseEvent } from "react";

export type MenuProps = {
  items: MenuItemProps[];
  subMenuDirection?: "left" | "right";
};

type ItemProps = {
  label?: string;
  icon?: string;
  items?: ItemProps[];
  href?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  target?: string;
};

export type MenuItemProps = ItemProps & {
  active?: boolean;
};

export type MenuInternalProps = MenuProps & {
  main?: boolean;
};

export type SubMenuProps = {
  items: SubMenuItemProps[];
};

export type SubMenuItemProps = ItemProps & {
  parentId: string;
};
