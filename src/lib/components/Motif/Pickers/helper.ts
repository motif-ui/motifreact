import { TimePeriod } from "@/components/TimePicker/types";

export const HOURS = [...Array.from({ length: 24 }, (_, idx) => idx)] as const;
export const HOURS12 = [...Array.from({ length: 12 }, (_, idx) => idx + 1)] as const;
export const MINUTES = [...Array.from({ length: 60 }, (_, idx) => idx)] as const;
export const SECONDS = [...Array.from({ length: 60 }, (_, idx) => idx)] as const;

export const twoDigits = (value?: number) => (value !== undefined ? String(value).padStart(2, "0") : undefined);

export const convert24To12Hour = (hour24: number) => (hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24);

export const convertTo24Hour = (hour12: number | undefined, period: TimePeriod) =>
  hour12 === undefined ? undefined : period === "am" ? (hour12 === 12 ? 0 : hour12) : hour12 === 12 ? 12 : hour12 + 12;
