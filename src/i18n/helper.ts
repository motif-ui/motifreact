import { DateLocale, LibraryTranslateFn } from "src/i18n/types.ts";

export const getDateLocale = (t: LibraryTranslateFn): DateLocale => ({
  months: t("date.months") as unknown as string[],
  monthsShort: t("date.monthsShort") as unknown as string[],
  weekDays: t("date.weekDays") as unknown as string[],

  today: t("date.today"),
  last: t("date.last"),
  days: t("date.days"),
  choose: t("g.choosePlease"),

  hoursAbbr: t("date.hoursAbbr"),
  minutesAbbr: t("date.minutesAbbr"),
  secondsAbbr: t("date.secondsAbbr"),
  am: t("date.am"),
  pm: t("date.pm"),
});
