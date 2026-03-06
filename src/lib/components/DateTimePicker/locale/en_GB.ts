import { DateTimePickerLocale } from "../../DateTimePicker/types";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const firstDayOfWeek = 1; // 0: Sunday, 1: Monday, ...
export const LOCALE_DATE_TIME_EN_GB: DateTimePickerLocale = {
  months,
  monthsShort,
  weekDays,
  firstDayOfWeek,
  hoursAbbr: "Hr",
  minutesAbbr: "Mn",
  secondsAbbr: "Sc",
  am: "AM",
  pm: "PM",
};
