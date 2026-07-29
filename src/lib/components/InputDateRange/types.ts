import { DateFormat, DaysOfWeek } from "../Motif/Pickers/types";
import { InputCommonProps, InputSize } from "../Form/types";
import type { DateRangePickerLocale } from "../DateRangePicker/types";
import type { IconGlobalType } from "../../types";

export type InputDateRangeProps = InputDateRangeDefaultableProps & InputCommonProps;

export type InputDateRangeDefaultableProps = {
  placeholder?: string;
  pill?: boolean;
  size?: InputSize;
  format?: DateFormat;
  locale?: DateRangePickerLocale;
  icon?: IconGlobalType | true;
  firstDayOfWeek?: DaysOfWeek;
};
