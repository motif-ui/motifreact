import { Time, TimePeriod } from "@/components/TimePicker/types";
import { TimeFormat } from "../Motif/Pickers/types";

export const hourEqualPeriodInsensitive = (hourToCheckIn24: number | undefined, hour: number, period?: TimePeriod) =>
  period === "am"
    ? hour === hourToCheckIn24 || (hourToCheckIn24 === 0 && hour === 12)
    : period === "pm"
      ? hour + 12 === hourToCheckIn24 || (hourToCheckIn24 === 12 && hour === 12)
      : hour === hourToCheckIn24;

export const getPeriodOfTime = (time: Time | undefined, format: TimeFormat | undefined): TimePeriod | undefined =>
  format !== "12h" ? undefined : time?.hours === undefined ? "am" : time.hours >= 12 ? "pm" : "am";
