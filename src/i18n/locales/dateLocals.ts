import { DaysOfWeek } from "@/components/Motif/Pickers/types";
import { LibraryTranslateFn } from "src/i18n/types.ts";

export const getDateLocale = (t: LibraryTranslateFn) => ({
  months: t("datepicker.months") as unknown as string[],
  monthsShort: t("datepicker.monthsShort") as unknown as string[],
  weekDays: t("datepicker.weekDays") as unknown as string[],
  firstDayOfWeek: Number(t("datepicker.firstDayOfWeek")) as DaysOfWeek,

  today: t("datepicker.today"),
  last: t("datepicker.last"),
  days: t("datepicker.days"),
  choose: t("datepicker.choose"),

  hoursAbbr: t("datepicker.hoursAbbr"),
  minutesAbbr: t("datepicker.minutesAbbr"),
  secondsAbbr: t("datepicker.secondsAbbr"),
  am: t("datepicker.am"),
  pm: t("datepicker.pm"),
});
