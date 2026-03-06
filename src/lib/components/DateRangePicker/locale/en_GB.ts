import type { DateRangePickerLocale } from "../types";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const firstDayOfWeek = 1; // 0: Sunday, 1: Monday, ...
const last = "Last";
const days = "days";
const today = "Today";
const choose = "Please choose";

export const LOCALE_DATE_RANGE_EN_GB: DateRangePickerLocale = { months, monthsShort, weekDays, firstDayOfWeek, days, last, today, choose };
