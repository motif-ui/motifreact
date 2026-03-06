import { Time } from "@/components/TimePicker/types";

export class DateUtils {
  static areEqualDates = (d1?: Date, d2?: Date) => {
    if (!d1 || !d2) return false;

    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };

  static areEqualMonths = (d1?: Date, d2?: Date) => {
    if (!d1 || !d2) return false;

    return d1.getMonth() === d2.getMonth();
  };

  static isInTheMonth = (date: Date, dateOfTheMonthToCheck: Date) =>
    date.getFullYear() === dateOfTheMonthToCheck.getFullYear() && date.getMonth() === dateOfTheMonthToCheck.getMonth();

  static getTodayTimeless = () => {
    const nowWithTime = new Date();
    nowWithTime.setHours(0, 0, 0, 0);
    return nowWithTime;
  };

  static getDateTimeless = (date?: Date) => {
    if (!date) return undefined;
    const dateTimeLess = new Date(date.getTime());
    dateTimeLess.setHours(0, 0, 0, 0);
    return dateTimeLess;
  };

  static getDateWithTime = (date: Date | undefined, time?: Time) => {
    if (!date) return undefined;
    const newDate = new Date(date.getTime());
    const { hours = 0, seconds = 0, minutes = 0 } = time || {};
    newDate.setHours(hours, minutes, seconds, 0);
    return newDate;
  };

  static getDateOfNextMonth = (date?: Date) => {
    const newDate = date ?? DateUtils.getTodayTimeless();
    return new Date(newDate.getFullYear(), newDate.getMonth() + 1, 1);
  };

  static getDateOfPrevMonth = (date?: Date) => {
    const newDate = date ?? DateUtils.getTodayTimeless();
    return new Date(newDate.getFullYear(), newDate.getMonth() - 1, 1);
  };

  static getNumberOfDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

  static isValidDay = (day: string, dayFormat?: "DD" | "D") => {
    const dayValue = parseInt(day, 10);
    const formatValid = dayFormat === "DD" ? /^\d{2}$/.test(day) : /^\d{1,2}$/.test(day);
    return formatValid && dayValue >= 1 && dayValue <= 31;
  };

  static isValidMonth = (month: string, monthFormat?: "MM" | "M") => {
    const monthValue = parseInt(month, 10);
    const formatValid = monthFormat === "MM" ? /^\d{2}$/.test(month) : /^\d{1,2}$/.test(month);
    return formatValid && monthValue >= 1 && monthValue <= 12;
  };

  static isValidYear = (year: string, yearFormat?: "YYYY" | "YY") => {
    return yearFormat === "YYYY" ? /^\d{4}$/.test(year) : /^\d{2}$/.test(year);
  };
}
