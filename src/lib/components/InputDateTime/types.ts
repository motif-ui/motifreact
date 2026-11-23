import { DateTimePickerLocale } from "../DateTimePicker/types";
import { TimeFormat, DateFormat, DaysOfWeek } from "../Motif/Pickers/types";
import { InputCommonProps, InputSize } from "../Form/types";
import type { OverlayRefProps } from "../../types";

export type InputDateTimeDefaultableProps = {
  pill?: boolean;
  editable?: boolean;
  secondsEnabled?: boolean;
  timeFormat?: TimeFormat;
  size?: InputSize;
  dateFormat?: DateFormat;
  locale?: DateTimePickerLocale;
  firstDayOfWeek?: DaysOfWeek;
};

export type InputDateTimeProps = {
  placeholder?: string;
  value?: Date;
  disabled?: boolean;
} & InputCommonProps &
  OverlayRefProps &
  InputDateTimeDefaultableProps;
