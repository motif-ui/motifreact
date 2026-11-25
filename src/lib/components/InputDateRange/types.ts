import { DateFormat, DaysOfWeek } from "../Motif/Pickers/types";
import { InputCommonProps, InputSize } from "../Form/types";
import type { DateRangePickerLocale } from "../DateRangePicker/types";
import type { IconGlobalType, OverlayRefProps } from "../../types";

export type InputDateRangeProps = InputDateRangeDefaultableProps & InputCommonProps & OverlayRefProps;

export type InputDateRangeDefaultableProps = {
  placeholder?: string;
  pill?: boolean;
  size?: InputSize;
  format?: DateFormat;
  locale?: DateRangePickerLocale;
  icon?: IconGlobalType | null;
  firstDayOfWeek?: DaysOfWeek;
};
