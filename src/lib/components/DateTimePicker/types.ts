import { DaysOfWeek, PickerPropsCommon, TimeFormat } from "../Motif/Pickers/types";
import { Time, TimePeriod, TimePickerLocale } from "../TimePicker/types";
import { Size4SM } from "../../types";
import { DatePickerLocale } from "../DatePicker/types";

export type ActiveTab = "date" | "time";

export type DateTimePickerProps = {
  value?: Date;
  onOkClick?: (dateTime?: Date) => void;
  onDateChange?: (date?: Date) => void;
  onTimeChange?: (time?: Time) => void;
  onClearClick?: () => void;
} & DateTimePickerDefaultableProps;

export type DateTimePickerDefaultableProps = {
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
  locale?: DateTimePickerLocale;
  firstDayOfWeek?: DaysOfWeek;
  removeActionButtons?: boolean;
  secondsEnabled?: boolean;
  timeFormat?: TimeFormat;
} & PickerPropsCommon;

export type DateTimePickerContextProps = {
  firstDayOfWeek: DaysOfWeek;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  size: Size4SM;
  locale: DateTimePickerLocale;
  selectedValue?: Date;
  setSelectedValue: (date?: Date) => void;
  selectedTimePeriod?: TimePeriod;
  setSelectedTimePeriod: (period: TimePeriod) => void;
  currentTime?: Time;
  secondsEnabled?: boolean;
  clearDateTimePicker: () => void;
  dateChangeHandler: (date?: Date) => void;
  timeChangeHandler: (time?: Time) => void;
  timeFormat: TimeFormat;
  fluid?: boolean;
};

export type DateTimePickerProviderProps = {
  firstDayOfWeek: DaysOfWeek;
  value: Date | undefined;
  locale: DateTimePickerLocale;
  size: Size4SM;
  onDateChange?: (date?: Date) => void;
  onTimeChange?: (time?: Time) => void;
  secondsEnabled?: boolean;
  timeFormat: TimeFormat;
  fluid?: boolean;
  onClearClick?: () => void;
};

export type DateTimePickerLocale = DatePickerLocale & TimePickerLocale;
