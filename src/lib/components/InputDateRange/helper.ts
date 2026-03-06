import { MaybeDateRange } from "@/components/InputDateRange/InputDateRange";

export const validateRange = (range: MaybeDateRange) => range?.every(date => !!date);

export const sanitizeRange = (range: MaybeDateRange) => (validateRange(range) ? (range as Date[]) : []);

export const areRangesEquals = (range1: MaybeDateRange, range2: MaybeDateRange) =>
  range1?.length === range2?.length && range1?.every((date, idx) => date?.getTime() === range2?.[idx]?.getTime());
