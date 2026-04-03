import { Size4SM } from "../../../types";

export type PickerPropsCommon = {
  size?: Size4SM;
  variant?: "bordered" | "shadow" | "borderless";
  fluid?: boolean;
};

export type DaysOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type TimeFormat = "12h" | "24h";

export type DateFormat = {
  order: ("day" | "month" | "year")[];
  prefix?: string[];
  delimiter?: string;
  dayFormat?: "DD" | "D";
  monthFormat?: "M" | "MM" | "MMM" | "MMMM";
  yearFormat?: "YYYY" | "YY";
};

export const defaultDateFormat: DateFormat = {
  order: ["day", "month", "year"],
  delimiter: "/",
  dayFormat: "DD",
  monthFormat: "MM",
  yearFormat: "YYYY",
};
