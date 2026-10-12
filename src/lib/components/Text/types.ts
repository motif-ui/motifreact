import { Size5 } from "src/lib/types.ts";

export type TextProps = {
  text?: string;
  tone?: "softer" | "soft" | "normal" | "strong" | "stronger";
  type?: "body" | "heading" | "paragraph" | "display" | "caption";
  size?: Size5;
  weight?: "light" | "regular" | "medium" | "semibold" | "bold";
  marginless?: boolean;
  uppercase?: boolean;
  /** @deprecated */
  variant?: TextVariants;
} & TextDefaultableProps;

export type TextDefaultableProps = {
  italic?: boolean;
  underline?: boolean;
  center?: boolean;
};

export type TextVariants =
  | "title1"
  | "title2"
  | "title3"
  | "body1"
  | "body2"
  | "body3"
  | "body4"
  | "body5"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p1"
  | "p2"
  | "p3";
