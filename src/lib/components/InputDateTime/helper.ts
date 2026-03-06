import { DateFormat } from "../Motif/Pickers/types";
import { formatDate, parseDate } from "@/components/InputDate/helper";
import { formatTime, parseTime } from "@/components/InputTime/helper";
import { TimeFormat } from "../Motif/Pickers/types";
import { TimePickerLocale } from "../TimePicker/types";

export const formatDateTime = (
  dateTime: Date | undefined,
  dateFormat: DateFormat,
  secondsEnabled: boolean,
  timeFormat: TimeFormat,
  locale: TimePickerLocale,
) => {
  const formattedDate = formatDate(dateTime, dateFormat);
  if (!formattedDate) return "";

  const formattedTime = formatTime(
    { hours: dateTime?.getHours(), minutes: dateTime?.getMinutes(), seconds: dateTime?.getSeconds() },
    false,
    secondsEnabled,
    timeFormat,
    locale,
  );
  return `${formattedDate} ${formattedTime}`.trim();
};

export const parseDateTime = (dateTimeString: string, format: DateFormat, secondsEnabled: boolean) => {
  const [dateString, timeString] = dateTimeString.split(" ");

  const date = parseDate(dateString, format);
  const time = parseTime(timeString, secondsEnabled);

  if (!date || !time) {
    return undefined;
  }

  date.setHours(time.hours ?? 0, time.minutes ?? 0, time.seconds ?? 0);
  return date;
};
