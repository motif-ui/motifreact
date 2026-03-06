import { Time, TimePickerLocale } from "../TimePicker/types";
import { twoDigits, convert24To12Hour } from "@/components/Motif/Pickers/helper";
import { TimeFormat } from "../Motif/Pickers/types";
import { getPeriodOfTime } from "@/components/TimePicker/helper";

export const formatTime = (
  time: Time | undefined,
  allowPartial: boolean,
  secondsEnabled: boolean,
  format: TimeFormat,
  locale: TimePickerLocale,
) => {
  if (
    !time ||
    (time.hours !== undefined && (time.hours < 0 || time.hours > 23)) ||
    (time.minutes !== undefined && (time.minutes < 0 || time.minutes > 59)) ||
    (time.seconds !== undefined && (time.seconds < 0 || time.seconds > 59)) ||
    (!allowPartial && (time.minutes === undefined || (secondsEnabled && time.seconds === undefined)))
  ) {
    return "";
  }

  const period = getPeriodOfTime(time, format);

  const hoursStr = `${twoDigits(format === "12h" ? convert24To12Hour(time.hours ?? 0) : time.hours) ?? (allowPartial ? "__" : "")}`;
  const minutesPart = `:${twoDigits(time.minutes) ?? (allowPartial ? "__" : "")}`;
  const secondsPart = secondsEnabled ? `:${twoDigits(time.seconds) ?? (allowPartial ? "__" : "")}` : "";
  const periodPart = period ? ` ${locale[period]}` : "";

  return `${hoursStr}${minutesPart}${secondsPart}${periodPart}`;
};

export const parseTime = (timeString: string | undefined, secondsEnabled: boolean) => {
  const pattern = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
  const patternWithSeconds = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;

  const match = timeString?.match(secondsEnabled ? patternWithSeconds : pattern);

  return match
    ? ({
        hours: parseInt(match[1], 10),
        minutes: parseInt(match[2], 10),
        ...(secondsEnabled && match[3] && { seconds: parseInt(match[3], 10) }),
      } as Time)
    : undefined;
};

export const validateTime = (time: Time | undefined, secondsEnabled: boolean) => {
  const { hours, minutes, seconds } = time ?? {};
  return hours !== undefined &&
    minutes !== undefined &&
    hours >= 0 &&
    hours < 24 &&
    minutes >= 0 &&
    minutes < 60 &&
    (secondsEnabled ? seconds !== undefined && seconds >= 0 && seconds < 60 : true)
    ? time
    : undefined;
};
