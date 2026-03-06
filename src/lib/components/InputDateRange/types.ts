import { DateFormat } from "../Motif/Pickers/types";
import { InputCommonProps, InputSize } from "../Form/types";
import type { DateRangePickerLocale } from "../DateRangePicker/types";

export type InputDateRangeProps = InputDateRangeDefaultableProps & InputCommonProps;

export type InputDateRangeDefaultableProps = {
  placeholder?: string;
  pill?: boolean;
  size?: InputSize;
  format?: DateFormat;
  locale?: DateRangePickerLocale;
};
