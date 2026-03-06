import { DateTimePickerLocale } from "../DateTimePicker/types";
import { TimeFormat, DateFormat } from "../Motif/Pickers/types";
import { InputCommonProps, InputSize } from "../Form/types";

export type InputDateTimeDefaultableProps = {
  pill?: boolean;
  editable?: boolean;
  secondsEnabled?: boolean;
  timeFormat?: TimeFormat;
  size?: InputSize;
  dateFormat?: DateFormat;
  locale?: DateTimePickerLocale;
};

export type InputDateTimeProps = {
  placeholder?: string;
  value?: Date;
  disabled?: boolean;
} & InputCommonProps &
  InputDateTimeDefaultableProps;
