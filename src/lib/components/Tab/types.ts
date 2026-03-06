import { ReactElement } from "react";

export type TabProps = {
  /**
   * ```
   * {
   *   id: string;
   *   title?: string;
   *   icon?: string;
   *   disabled?: boolean;
   * }[]
   * ```
   */
  tabs: TabItemProps[];
  onTabChange?: (id: string) => void;
  children?: ReactElement<TabItemProps> | (ReactElement<TabItemProps> | null | boolean)[] | null | boolean;
  defaultTabId?: string;
} & TabDefaultableProps;

export type TabDefaultableProps = {
  type?: "underline" | "solid";
  position?: "left" | "center" | "right" | "fill";
};

export type TabItemProps = {
  id: string;
  title?: string;
  icon?: string;
  disabled?: boolean;
};

export type TabProviderProps = {
  initialSelectedTabId: string;
  onTabChange?: (id: string) => void;
};

export type TabContextProps = {
  selectedTabId?: string;
  tabClickHandler?: (tabId: string) => void;
};
