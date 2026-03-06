import { Size4SM } from "../../types";
import { DaysOfWeek, PickerPropsCommon } from "../Motif/Pickers/types";
import { LOCALE_DATE_TR_TR } from "./locale/tr_TR";
import { DateUtils } from "../../../utils/dateUtils";

export type DatePickerProps = {
  value?: Date;
  onOkClick?: (date?: Date) => void;
  onClearClick?: () => void;
  onDateChange?: (date?: Date) => void;
  onPickerChange?: (picker: DatePickerPickerType) => void;
} & DatePickerDefaultableProps;

export type DatePickerDefaultableProps = {
  /**
   * ```
   * {
   *   // Full month names
   *   months: string[];
   *
   *   // 3 letters
   *   monthsShort: string[];
   *
   *   // 2 letters
   *   weekDays: string[];
   *
   *   firstDayOfWeek: 0|1|2|3|4|5|6;
   * }
   * ```
   */
  locale?: DatePickerLocale;
  removeActionButtons?: boolean;
} & PickerPropsCommon;

export type DatePickerProviderProps = {
  size: Size4SM;
  value: Date | undefined;
  locale: DatePickerLocale;
  fluid: boolean;
  onDateChange?: (date?: Date) => void;
  onPickerChange?: (picker: DatePickerPickerType) => void;
  onClearClick?: () => void;
};

export type DatePickerPickerType = "day" | "month" | "year";

export type DatePickerContextProps = {
  size: Size4SM;
  locale: DatePickerLocale;
  pickerDate: Date; // The date that is used to hold the values when choosing temporary values like months or years.
  picker: DatePickerPickerType;
  selectedDate?: Date;
  previousTab: "day" | "month";
  fluid: boolean;
  today: Date;
  clearDatePicker: () => void;
  setPickerDate: (date: Date) => void;
  setSelectedDate: (date?: Date) => void;
  setPicker: (picker: DatePickerPickerType) => void;
  onYearMonthTabSelected: (nextTab: "month" | "year", previousTab: "day" | "month") => void;
  onDateChange?: (date?: Date) => void;
  onPickerChange?: (picker: DatePickerPickerType) => void;
};

export type DatePickerLocale = {
  months: string[];
  monthsShort: string[];
  weekDays: string[];
  firstDayOfWeek: DaysOfWeek;
};

export const datePickerContextDefaultValues: DatePickerContextProps = {
  size: "md",
  pickerDate: DateUtils.getTodayTimeless(),
  picker: "day",
  previousTab: "day",
  clearDatePicker: () => {},
  setPickerDate: () => {},
  locale: LOCALE_DATE_TR_TR,
  onYearMonthTabSelected: () => {},
  fluid: false,
  today: DateUtils.getTodayTimeless(),
  setSelectedDate: () => {},
  setPicker: () => {},
};
