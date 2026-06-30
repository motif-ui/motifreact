import { InputCommonProps, InputSize } from "../Form/types";
import { DateFormat, DaysOfWeek } from "../Motif/Pickers/types";
import { DatePickerLocale } from "../DatePicker/types";

export type InputDateDefaultableProps = {
  format?: DateFormat;
  editable?: boolean;
  placeholder?: string;
  pill?: boolean;
  size?: InputSize;
  locale?: DatePickerLocale;
  firstDayOfWeek?: DaysOfWeek;
};

export type InputDateProps = InputCommonProps & InputDateDefaultableProps;
