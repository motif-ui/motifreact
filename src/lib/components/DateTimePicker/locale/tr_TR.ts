import { DateTimePickerLocale } from "../../DateTimePicker/types";

const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const monthsShort = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
const weekDays = ["Pz", "Pt", "Sa", "Çr", "Pe", "Cu", "Ct"];
const firstDayOfWeek = 1; // 0: Sunday, 1: Monday, ...
export const LOCALE_DATE_TIME_TR_TR: DateTimePickerLocale = {
  months,
  monthsShort,
  weekDays,
  firstDayOfWeek,
  hoursAbbr: "Sa",
  minutesAbbr: "Da",
  secondsAbbr: "Sn",
  am: "ÖÖ",
  pm: "ÖS",
};
