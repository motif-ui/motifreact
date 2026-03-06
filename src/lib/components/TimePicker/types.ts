import { Size4SM } from "../../types";
import { LOCALE_TIME_PICKER_TR_TR } from "./locale/tr_TR";
import { PickerPropsCommon, TimeFormat } from "../Motif/Pickers/types";

export type TimePickerProps = {
  value?: Time;
  onOkClick?: (time?: Time) => void;
  onTimeChange?: (time?: Time) => void;
  onPeriodChange?: (period: TimePeriod) => void;
  onClearClick?: () => void;
} & TimePickerDefaultableProps;

export type TimePickerDefaultableProps = {
  secondsEnabled?: boolean;
  format?: TimeFormat;
  locale?: TimePickerLocale;
} & PickerPropsCommon;

export type TimePickerProviderProps = {
  size: Size4SM;
  secondsEnabled: boolean;
  locale: TimePickerLocale;
  onTimeChange?: (time?: Time) => void;
  onPeriodChange?: (period: TimePeriod) => void;
  value?: Time;
  format: TimeFormat;
  onClearClick?: () => void;
};

export type TimeContextProps = {
  size: Size4SM;
  locale: TimePickerLocale;
  resetTime: () => void;
  secondsEnabled: boolean;
  setTimeItem: (type: TimeType, value: number) => void;
  time?: Time;
  format: TimeFormat;
  timePeriod?: TimePeriod;
  changeTimePeriod: (newPeriod: TimePeriod) => void;
};

export const timeContextDefaultValues: TimeContextProps = {
  size: "md",
  locale: LOCALE_TIME_PICKER_TR_TR,
  resetTime: () => {},
  secondsEnabled: false,
  setTimeItem: () => {},
  format: "24h",
  changeTimePeriod: () => {},
};

export type Time = {
  hours?: number;
  minutes?: number;
  seconds?: number;
};

export type TimeType = "hours" | "minutes" | "seconds";
export type TimePeriod = "am" | "pm";

export type TimePickerLocale = {
  hoursAbbr: string;
  minutesAbbr: string;
  secondsAbbr: string;
  am: string;
  pm: string;
};
