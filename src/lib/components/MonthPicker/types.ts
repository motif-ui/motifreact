import { PickerPropsCommon } from "../Motif/Pickers/types";
import { DatePickerLocale } from "../DatePicker/types";

export type MonthPickerProps = {
  /** Index of the selected month: 0 for January, 11 for December. */
  value?: number;
  /** Called with the index of the clicked month (0 for January) when it differs from the selected one. */
  onMonthChange?: (month: number) => void;
} & MonthPickerDefaultableProps;

export type MonthPickerDefaultableProps = {
  /**
   * ```
   * {
   *   // 3 letters
   *   monthsShort: string[];
   * }
   * ```
   */
  locale?: Pick<DatePickerLocale, "monthsShort">;
} & PickerPropsCommon;
