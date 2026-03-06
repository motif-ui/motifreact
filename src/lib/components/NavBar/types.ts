import { NavBarLogoProps } from "./components/NavBarLogo";
import { NavBarSearchProps } from "./components/NavBarSearch";
import { NavBarButtonProps } from "./components/NavBarButton";
import { MenuProps } from "./components/NavBarMenu/types";

export type NavBarVariant = "neutral" | "primary" | "secondary" | "info" | "success" | "warning" | "danger";

export type NavBarProps = {
  /**
   * ```
   * {
   *   placeholder?: string;
   *   onSubmit: (query: string) => void;
   *   pill?: boolean;
   * }
   * ```
   */
  search?: NavBarSearchProps;
  /**
   * ```
   * {
   *   label?: string;
   *   icon?: string;
   *   pill?: boolean;
   *   onClick?: (event: MouseEvent) => void;
   * }
   * ```
   */
  button?: NavBarButtonProps;
  /**
   * ```
   * {
   *   items: {
   *    label?: string;
   *    icon?: string;
   *    items?: ItemProps[];
   *    href?: string;
   *    onClick?: (event: MouseEvent) => void;
   *    target?: string;
   *   }[];
   *   subMenuDirection?: "left" | "right";
   * }
   * ```
   */
  mainMenu?: MenuProps;
  /**
   * ```
   * {
   *   items: {
   *    label?: string;
   *    icon?: string;
   *    items?: ItemProps[];
   *    href?: string;
   *    onClick?: (event: MouseEvent) => void;
   *    target?: string;
   *   }[];
   *   subMenuDirection?: "left" | "right";
   * }
   * ```
   */
  actionMenu?: MenuProps;
} & NavBarDefaultableProps;

export type NavBarDefaultableProps = {
  variant?: NavBarVariant;
  elevated?: boolean;
  /**
   * ```
   * {
   *   imgPath: string;
   *   alt?: string;
   *   href?: string;
   * }
   * ```
   */
  logo?: NavBarLogoProps;
};

export type NavBarContextProps = {
  variant: NavBarVariant;
};

export type NavBarMenuContextProps = {
  isOpen: (id: string) => boolean;
  toggleMenu: (id: string, parentId?: string) => void;
  closeAll: () => void;
};

export const navBarMenuContextDefaults: NavBarMenuContextProps = {
  isOpen: () => false,
  toggleMenu: () => {},
  closeAll: () => {},
};
