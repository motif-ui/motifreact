import { InputCommonProps, InputSize, InputValue } from "../Form/types";
import { TimePickerLocale } from "../TimePicker/types";
import { TimeFormat } from "../Motif/Pickers/types";

export type InputTimeProps = {
  /**
   * ```
   * {
   *   hours: number;
   *   minutes: number;
   *   seconds?: number;
   * }
   * ```
   */
  value?: InputValue;
} & InputCommonProps &
  InputTimeDefaultableProps;

export type InputTimeDefaultableProps = {
  placeholder?: string;
  editable?: boolean;
  pill?: boolean;
  secondsEnabled?: boolean;
  size?: InputSize;
  format?: TimeFormat;
  locale?: TimePickerLocale;
};
