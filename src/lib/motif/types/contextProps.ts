import { StandardProps } from "../../types";
import type { ComponentDefaultableProps } from "./componentDefaultableProps";
import { ColorBorder, ColorSemantic, ColorSurface, ColorText, Elevation, Grid, Sizing, Typography } from "./cssVariablesType";

export type MotifProviderProps = {
  locale?: Locale;
  baseIconClass?: string;
  componentDefaults?: ComponentDefaults;
  font?: string;
  theme?: Theme;
};

export type MotifContextProps = {
  locale: Locale;
  baseIconClass: string;
  componentDefaults: ComponentDefaults;
  theme?: Theme;
  setComponentDefaults: (defaults: ComponentDefaults) => void;
  setLocale: (locale: Locale) => void;
  setBaseIconClass: (iconClass: string) => void;
  setFont: (font: string) => void;
  setTheme: (theme: Theme) => void;
};

export type ColorMode = "dark" | "light";

export type Locale = "tr" | "en";

export type Theme = {
  color?: {
    surface?: ColorSurface;
    border?: ColorBorder;
    text?: ColorText;
    semantic?: ColorSemantic;
  };
  typography?: Typography;
  sizing?: Sizing;
  elevation?: Elevation;
  grid?: Grid;
  opacity?: Record<string, string | number>;
};

export type ComponentDefaults = ComponentDefaultsWithStandardProps<ComponentDefaultableProps, StandardProps>;

type ComponentDefaultsWithStandardProps<T, TCommon> = {
  [K in keyof T]: T[K] extends infer U ? U & TCommon : never;
};
