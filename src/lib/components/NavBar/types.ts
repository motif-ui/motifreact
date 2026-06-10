import { NavBarLogoProps } from "./components/NavBarLogo";
import { NavBarButtonProps } from "./components/NavBarButton";
import { MenuProps } from "./components/NavBarMenu/types";
import { Size3 } from "src/lib/types.ts";

export type NavBarVariant = "neutral" | "primary" | "secondary" | "info" | "success" | "warning" | "danger";

export type NavBarProps = {
  /**
   * ```
   * {
   *   placeholder?: string;
   *   pill?: boolean;
   *   onPressEnter?: (query: string) => void;
   *   onButtonClick?: (query: string) => void;
   *   searching?: boolean;
   *   onResultClick?: (value?: string) => void;
   *   results: { text: string; value?: string; }[];
   *   visibleContainerSize?: Size3;
   * }
   * ```
   */
  search?: NavBarSearchProps;
  /**
   * ```
   * {
   *   label?: string;
   *   icon?: IconGlobalType;
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
   *    icon?: IconGlobalType;
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
   *    icon?: IconGlobalType;
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
   *   image: ReactElement;
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

export type NavBarSearchProps = {
  placeholder?: string;
  pill?: boolean;
  onPressEnter?: (query: string) => void;
  onButtonClick?: (query: string) => void;
  searching?: boolean;
} & NavBarSearchResultsProps;

export type NavBarSearchResultsProps = {
  onResultClick?: (value?: string) => void;
  results?: {
    text: string;
    value?: string;
  }[];
  visibleContainerSize?: Size3;
};

export const navBarMenuContextDefaults: NavBarMenuContextProps = {
  isOpen: () => false,
  toggleMenu: () => {},
  closeAll: () => {},
};
