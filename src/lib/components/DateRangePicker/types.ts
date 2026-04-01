import { PickerPropsCommon } from "../Motif/Pickers/types";
import { Size4SM } from "../../types";
import { LOCALE_DATE_RANGE_TR_TR } from "@/components/DateRangePicker/locale/tr_TR";
import { Dispatch, SetStateAction } from "react";
import { DatePickerLocale } from "@/components/DatePicker/types";

export type DateRangePickerProps = {
  value?: (Date | undefined)[];
  onOkClick?: (range: (Date | undefined)[]) => void;
  onClearClick?: () => void;
  onDateChange?: (dates: (Date | undefined)[]) => void;
} & DateRangePickerDefaultableProps;

export type DateRangePickerDefaultableProps = {
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
   *
   *   // 'Today' text in selector
   *   today: string;
   *
   *   // 'Last' text in selector
   *   last: string;
   *
   *   // 'days' text in selector
   *   days: string;
   *
   *   // 'choose' text in selector
   *   choose: string;
   * }
   * ```
   */
  locale?: DateRangePickerLocale;
  removeActionButtons?: boolean;
} & Omit<PickerPropsCommon, "fluid">;

export type DateRangePickerProviderProps = {
  value: (Date | undefined)[] | undefined;
  locale: DateRangePickerLocale;
  size: Size4SM;
  onDateChange?: (dates: (Date | undefined)[]) => void;
};

export type DateRangePickerContextProps = {
  locale: DateRangePickerLocale;
  size: Size4SM;
  dateCouple: (Date | undefined)[];
  setDateCouple: Dispatch<SetStateAction<(Date | undefined)[]>>;
  sliding: "slideLeft" | "slideRight" | undefined;
  setSliding: (sliding: "slideLeft" | "slideRight" | undefined) => void;
  setMonths: (months: Date[][]) => void;
  months: Date[][];
  today: Date;
  onDateChange?: (dates: (Date | undefined)[]) => void;
  getDaysOfMonth: (month: Date) => Date[];
  initialMonths: Date[][];
  partialSelection?: Date;
};

export type DateRangePickerLocale = {
  today: string;
  last: string;
  days: string;
  choose: string;
} & DatePickerLocale;

export const datePickerContextDefaultValues: DateRangePickerContextProps = {
  locale: LOCALE_DATE_RANGE_TR_TR,
  size: "md",
  dateCouple: [undefined, undefined],
  setSliding: () => {},
  sliding: undefined,
  months: [],
  today: new Date(),
  setMonths: () => {},
  setDateCouple: () => {},
  getDaysOfMonth: () => [],
  initialMonths: [],
};
