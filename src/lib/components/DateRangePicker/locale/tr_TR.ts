import type { DateRangePickerLocale } from "../types";

const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const monthsShort = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
const weekDays = ["Pz", "Pt", "Sa", "Çr", "Pe", "Cu", "Ct"];
const firstDayOfWeek = 1; // 0: Sunday, 1: Monday, ...
const last = "Son";
const days = "gün";
const today = "Bugün";
const choose = "Lütfen seçiniz";

export const LOCALE_DATE_RANGE_TR_TR: DateRangePickerLocale = { months, monthsShort, weekDays, firstDayOfWeek, days, last, today, choose };
