import type { CSSProperties, Ref } from "react";
import { PropsWithChildren } from "react";
import { locales } from "../i18n/locales";

export type KeyValue = {
  key: string;
  value: string;
};

export type HttpMethods = "GET" | "POST" | "PUT" | "DELETE";

export type Size3 = "sm" | "md" | "lg";
export type Size4SM = "xs" | Size3;
export type Size4LG = Size3 | "xl";
export type Size5 = "xs" | Size3 | "xl";
export type Size7 = "xxs" | Size5 | "xxl";

export type StandardProps = {
  className?: string;
  style?: CSSProperties;
};
type RefType<R> = {
  ref?: Ref<R>;
};
export type PropsWithRef<P = unknown, R = unknown> = P & StandardProps & RefType<R>;
export type PropsWithRefAndChildren<P = unknown, R = unknown> = PropsWithChildren<P> & StandardProps & RefType<R>;

/** The shape of a locale file — use this to type custom locale objects. */
export type LocaleShape = typeof locales.en;

/**
 * Recursively makes all keys optional, so consumers can provide only the
 * strings they want to override without supplying the entire locale.
 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown> ? DeepPartial<T[K]> : T[K];
};
