import { SCREEN_SIZES } from "../lib/constants";
import type { ReactNode } from "react";
import { isValidElement } from "react";

export const generateUUIDV4 = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => (c === "4" ? "4" : ((Math.random() * 16) | 0x8).toString(16)));
export const isSmallScreen = typeof window !== "undefined" && window.innerWidth <= SCREEN_SIZES.SM;

export const capitalizeFirstLetter = (str: string) => {
  return str && str.charAt(0).toUpperCase() + str.slice(1);
};

export const shortenText = (text: string, maxVisibleChars: number) => {
  return text.length > maxVisibleChars ? `${text.slice(0, maxVisibleChars).trim()}...` : text.trim();
};

export function formatBytes(a: number, b = 2) {
  if (!+a) return "0 Bytes";
  const c = b < 0 ? 0 : b;
  const d = Math.floor(Math.log10(a) / Math.log10(1000));
  const e = a / Math.pow(1000, d);
  return `${parseFloat(e.toFixed(c))} ${["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]}`;
}

export const getValueByChainedKey = <T>(obj: object, key?: string) =>
  (key ? key.split(".").reduce((acc: object | undefined, k) => acc?.[k as keyof typeof acc], obj) : obj) as T;

export const getNextItemInArray = <T>(arr: T[], item: T) => arr[(arr.indexOf(item) + 1) % arr.length];

export const getRandomItemFromArray = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export const rotateArray = <T>(arr: T[], direction: "left" | "right", step: number) =>
  arr.map((_, index, a) => a[(direction === "left" ? index + step : a.length + index - step) % a.length]);

export const getStaticPropNames = (cls: new (...args: unknown[]) => unknown) =>
  Object.getOwnPropertyNames(cls).filter(prop => prop !== "prototype" && prop !== "length" && prop !== "name");

export const getTextFromNode = (node?: ReactNode): string =>
  typeof node === "string" || typeof node === "number"
    ? (node as string)
    : !isValidElement(node)
      ? ""
      : Array.isArray((node.props as { children?: ReactNode | ReactNode[] }).children)
        ? (node.props as { children: ReactNode[] }).children.map(getTextFromNode).join(" ")
        : getTextFromNode((node.props as { children?: ReactNode }).children);

export const isNotAvailable = (value: unknown) =>
  value === null || value === undefined || (typeof value === "string" && value.trim() === "");

/**
 * Converts a camelCase string to kebab-case
 * Example: "primaryDefault" -> "primary-default"
 */
export const camelToKebab = (str: string) => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

export const compareByDiffWithFlooringValues = (n1: number, n2: number, diffValue: number) => Math.floor(n1) - Math.floor(n2) > diffValue;

/** Check if value is a plain object */
export const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

/** Shortcut for Object.prototype.hasOwnProperty with safe checks */
export const hasOwn = (o: unknown, k: string): boolean => isObj(o) && Object.prototype.hasOwnProperty.call(o, k);
