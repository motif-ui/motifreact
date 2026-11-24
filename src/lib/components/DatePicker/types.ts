import { Size4SM } from "../../types";
import { DaysOfWeek, PickerPropsCommon } from "../Motif/Pickers/types";
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
   * }
   * ```
   */
  locale?: DatePickerLocale;
  removeActionButtons?: boolean;
  firstDayOfWeek?: DaysOfWeek;
} & PickerPropsCommon;

export type DatePickerProviderProps = {
  size: Size4SM;
  value: Date | undefined;
  locale: DatePickerLocale;
  fluid: boolean;
  onDateChange?: (date?: Date) => void;
  onPickerChange?: (picker: DatePickerPickerType) => void;
  onClearClick?: () => void;
  firstDayOfWeek: DaysOfWeek;
};

export type DatePickerPickerType = "day" | "month" | "year";

export type DatePickerContextProps = {
  size: Size4SM;
  firstDayOfWeek: DaysOfWeek;
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
};

export const datePickerContextDefaultValues: DatePickerContextProps = {
  size: "md",
  pickerDate: DateUtils.getTodayTimeless(),
  picker: "day",
  previousTab: "day",
  clearDatePicker: () => {},
  setPickerDate: () => {},
  onYearMonthTabSelected: () => {},
  fluid: false,
  today: DateUtils.getTodayTimeless(),
  setSelectedDate: () => {},
  setPicker: () => {},
  firstDayOfWeek: 1,
  locale: {
    months: [],
    monthsShort: [],
    weekDays: [],
  },
};
