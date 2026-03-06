import type { CSSProperties, Ref } from "react";
import { PropsWithChildren } from "react";

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
