import { DateFormat } from "../Motif/Pickers/types";
import { DateUtils } from "../../../utils/dateUtils";

type DateParts = {
  day?: string;
  month?: string;
  year?: string;
};

/**
 * Formats a Date object according to the specified format
 */
export const formatDate = (date: Date | undefined, format: DateFormat) => {
  if (!date) return "";
  const { order, delimiter, dayFormat, monthFormat, yearFormat, prefix = [] } = format;

  // Format parts functions
  const formatDay = (day: number): string => {
    const dayString = day.toString();
    return dayFormat === "DD" ? dayString.padStart(2, "0") : dayString;
  };

  const formatMonth = (month: number): string => {
    const monthString = (month + 1).toString();
    return monthFormat === "MM" ? monthString.padStart(2, "0") : monthString;
  };

  const formatYear = (year: number): string => {
    const yearString = year.toString();
    return yearFormat === "YY" ? yearString.slice(-2) : yearFormat === "YYYY" ? yearString.padStart(4, "0") : yearString;
  };

  // Create formatter map
  const formatters: Record<string, () => string> = {
    day: () => formatDay(date.getDate()),
    month: () => formatMonth(date.getMonth()),
    year: () => formatYear(date.getFullYear()),
  };

  // Format each part with its corresponding prefix
  const formattedParts = order.map((part, index) => {
    const formattedValue = formatters[part]();
    const prefixValue = prefix[index] || "";
    return `${prefixValue}${formattedValue}`;
  });

  return formattedParts.join(delimiter);
};

/**
 * Validates and parses a date string according to the specified format and returns a Date object
 */
export const parseDate = (dateString: string, format: DateFormat): Date | undefined => {
  const { order, delimiter, dayFormat, monthFormat, yearFormat, prefix = [] } = format;

  // Extract and validate string parts
  const extractDateParts = (): DateParts | null => {
    const parts = delimiter ? dateString.split(delimiter) : [dateString];

    if (parts.length !== order.length) {
      return null;
    }

    return order.reduce<DateParts | null>((acc, curr, index) => {
      if (acc === null) return null;

      const part = parts[index];
      const expectedPrefix = prefix[index] || "";

      if (expectedPrefix && !part.startsWith(expectedPrefix)) {
        return null;
      }

      const value = expectedPrefix ? part.slice(expectedPrefix.length) : part;

      return { ...acc, [curr]: value };
    }, {});
  };

  const dateValues = extractDateParts();
  if (!dateValues) {
    return undefined;
  }

  // Ensure all parts are present and valid
  const isPartsPresentAndValid = order.every(key => {
    const value = dateValues[key];
    if (!value) return false;

    switch (key) {
      case "day":
        return DateUtils.isValidDay(value, dayFormat);
      case "month":
        return DateUtils.isValidMonth(value, monthFormat);
      case "year":
        return DateUtils.isValidYear(value, yearFormat);
      default:
        return false;
    }
  });

  if (!isPartsPresentAndValid) {
    return undefined;
  }

  // Parse numeric values
  const year = parseInt(dateValues.year ?? "", 10);
  const fullYear = yearFormat === "YY" ? 2000 + year : year;
  const month = parseInt(dateValues.month ?? "", 10);
  const day = parseInt(dateValues.day ?? "", 10);

  // Create and validate date
  const date = new Date(fullYear, month - 1, day);
  const isValid = date.getTime() && date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === fullYear;

  return isValid ? date : undefined;
};
