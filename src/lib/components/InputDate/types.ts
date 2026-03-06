import { InputCommonProps, InputSize } from "../Form/types";
import { DateFormat } from "../Motif/Pickers/types";
import { DateTimePickerLocale } from "../DateTimePicker/types";

export type InputDateDefaultableProps = {
  format?: DateFormat;
  editable?: boolean;
  placeholder?: string;
  pill?: boolean;
  size?: InputSize;
  locale?: DateTimePickerLocale;
};

export type InputDateProps = InputCommonProps & InputDateDefaultableProps;
