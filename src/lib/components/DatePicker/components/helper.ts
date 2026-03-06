import { DaysOfWeek } from "@/components/Motif/Pickers/types";
import { DateUtils } from "../../../../utils/dateUtils";

export const calculateYears = (from: number, to: number) => Array.from({ length: to - from }, (_, index) => from + index);

export const calculateWeeks = (year: number, month: number, firstDayOfWeek: DaysOfWeek) => {
  //get the first date object of the month
  const currentMonthFirstDate = new Date(year, month, 1 - firstDayOfWeek);
  //get the day number of the week of the first date of the month
  const currentMonthFirstDay = currentMonthFirstDate.getDay();
  // get the current month length
  const currentMonthLastDate = DateUtils.getNumberOfDaysInMonth(year, month);
  // day count in a week
  const dayCountInWeek = 7;
  // minimum week count to display
  const minWeekCount = 5;
  //determine if 6 or 5 weeks have to be displayed for this month
  const numberOfWeeksToDisplay =
    currentMonthFirstDay + currentMonthLastDate > dayCountInWeek * minWeekCount ? minWeekCount + 1 : minWeekCount;

  return Array.from({ length: numberOfWeeksToDisplay }, (_, indexR) => {
    const dayStartPosition = indexR * dayCountInWeek - currentMonthFirstDay;
    return Array.from({ length: dayCountInWeek }, (_, indexC) => new Date(year, month, dayStartPosition + indexC + 1));
  });
};

export const calculateWeeksFlat = (month: Date, firstDayOfWeek: DaysOfWeek) =>
  calculateWeeks(month.getFullYear(), month.getMonth(), firstDayOfWeek).flat();
