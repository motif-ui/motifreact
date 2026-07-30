import { InputCommonProps, InputSize } from "../Form/types";
import { DateFormat, DaysOfWeek } from "../Motif/Pickers/types";
import { DatePickerLocale } from "../DatePicker/types";
import type { IconGlobalType } from "../../types";

export type InputDateDefaultableProps = {
  format?: DateFormat;
  editable?: boolean;
  placeholder?: string;
  pill?: boolean;
  size?: InputSize;
  locale?: DatePickerLocale;
  firstDayOfWeek?: DaysOfWeek;
  icon?: IconGlobalType | null;
};

export type InputDateProps = InputCommonProps & InputDateDefaultableProps;
