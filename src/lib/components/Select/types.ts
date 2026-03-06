import { InputCommonProps } from "../Form/types";

export type SelectItem = { label?: string; value: string };
export type SelectGroupItem = { groupLabel: string; groupKey: string; items: SelectItem[] };
export type SelectOrGroupItem = SelectItem | SelectGroupItem;

export type SelectProps = {
  icon?: string;
  placeholder?: string;
  loading?: boolean;
  data: (SelectItem | SelectGroupItem)[];
} & InputCommonProps &
  SelectDefaultableProps;

export type SelectDefaultableProps = {
  multiple?: boolean;
  native?: boolean;
  filterable?: boolean;
};
