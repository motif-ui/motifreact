import { InputCommonProps, InputSize } from "../Form/types";
import { DateFormat } from "../Motif/Pickers/types";
import { DatePickerLocale } from "../DatePicker/types";

export type InputDateDefaultableProps = {
  format?: DateFormat;
  editable?: boolean;
  placeholder?: string;
  pill?: boolean;
  size?: InputSize;
  locale?: DatePickerLocale;
};

export type InputDateProps = InputCommonProps & InputDateDefaultableProps;
