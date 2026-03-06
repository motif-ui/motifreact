export type TextProps = {
  text?: string;
} & TextDefaultableProps;

export type TextDefaultableProps = {
  variant?: TextVariants;
  italic?: boolean;
  underline?: boolean;
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
