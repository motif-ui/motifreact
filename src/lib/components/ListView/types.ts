import { Size3 } from "../../types";
import { ReactElement } from "react";

export type ListViewProps = {
  /**
   * available if selectable is true
   */
  onSelectionChange?: (info: SelectionInfo) => void;
  children: ReactElement<ListViewItemProps> | (ReactElement<ListViewItemProps> | null | boolean)[] | null | boolean;
} & ListViewDefaultableProps;

export type ListViewDefaultableProps = {
  size?: Size3;
  enableDividers?: boolean;
  disableAvatars?: boolean;
  selectable?: boolean;
  enableMultiLine?: boolean;
};

export type ListViewItemProps = {
  title: string;
  description?: string;
  alternateText?: string;
  icon?: string | ReactElement;
  image?: string;
  abbr?: string;
  iconRight?: string | ReactElement;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  /**
   * it should be given if selectable is true
   */
  id?: string;
};

export type ListViewProviderProps = {
  size: Size3;
  selectable: boolean;
  enableDividers: boolean;
  enableMultiLine?: boolean;
  disableAvatars: boolean;
  onSelectionChange?: (info: { current: { id: string; selected: boolean }; selectedIds: string[] }) => void;
};

export type ListViewContextType = {
  size: Size3;
  selectable?: boolean;
  enableDividers?: boolean;
  enableMultiLine?: boolean;
  disableAvatars?: boolean;
  selectHandler?: (id: string, selected: boolean) => void;
};

type SelectionInfo = {
  current: { id: string; selected: boolean };
  selectedIds: string[];
};
