// Theme seed file (src/lib/styles/tokens/themes/*.json)
export type Theme = {
  colors: Record<string, string>;
  background?: string;
  text?: string;
  radius: number;
  space: number;
  fontSize: number;
};

export type Dimension = { value: number; unit: "rem" | "px" };

export type Shadow = { color: string; offsetX: Dimension; offsetY: Dimension; blur: Dimension; spread: Dimension };

type TokenBase = { path: string[]; description?: string; dark?: string };

/** A color or font weight is either a literal or a DTCG alias (`{color.palette.neutral.50}`); `dark` only when the mode differs. */
export type Token = TokenBase &
  (
    | { type: "color"; value: string }
    | { type: "dimension"; value: Dimension }
    | { type: "fontWeight"; value: number | string }
    | { type: "fontFamily"; value: string }
    | { type: "shadow"; value: Shadow }
  );

export type FigmaAlias = { alias: string };

export type FigmaValue = string | number | FigmaAlias;

export type FigmaVariable = {
  name: string;
  type: "COLOR" | "FLOAT" | "STRING";
  scopes: string[];
  hiddenFromPublishing: boolean;
  description?: string;
  values: Record<string, FigmaValue>;
};

export type FigmaCollection = { name: string; modes: string[]; variables: FigmaVariable[] };

export type FigmaEffectStyle = {
  name: string;
  description?: string;
  effects: { type: "DROP_SHADOW"; offset: { x: number; y: number }; radius: number; spread: number; color: FigmaAlias }[];
};

export type FigmaTextStyle = { name: string } & Record<"fontFamily" | "fontSize" | "lineHeight" | "fontWeight", FigmaAlias>;

export type FigmaPayload = { collections: FigmaCollection[]; effectStyles: FigmaEffectStyle[]; textStyles: FigmaTextStyle[] };
