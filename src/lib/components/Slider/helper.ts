import type { MouseEvent } from "react";

export const normalizeValueByStep = (value: number, step: number, min: number, func?: "floor" | "round") => {
  return Math[func ?? "round"]((value - min) / step) * step + min;
};
export const calculateRealClickedValue = (min: number, max: number, e: MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const rate = (e.clientX - rect.left) / rect.width;
  return Math.round(min + (max - min) * rate);
};
