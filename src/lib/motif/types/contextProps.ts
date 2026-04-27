import { StandardProps } from "../../types";
import type { ComponentDefaultableProps } from "./componentDefaultableProps";
import { ColorBorder, ColorSemantic, ColorSurface, ColorText, Elevation, Grid, Sizing, Typography } from "./cssVariablesType";
import type { Locale } from "../../../i18n/locales/index";
import { LibraryTranslateFn, LocaleConfig } from "../../../i18n/types";

export type MotifProviderProps = {
  /**
   * Active locale. Accepts a plain locale string or an object that pairs the
   * locale with optional text overrides — keeping them co-located and in sync.
   *
   * @example
   * // Built-in locale, no overrides
   * <MotifProvider locale="tr" />
   *
   * @example
   * // Partial override of built-in strings
   * <MotifProvider locale={{ locale: "tr", texts: { upload: { browse: "Gözat..." } } }} />
   *
   * @example
   * // Fully custom locale for an unsupported language
   * <MotifProvider locale={{ texts: frenchTexts }} />
   */
  locale?: LocaleConfig;
  baseIconClass?: string;
  componentDefaults?: ComponentDefaults;
  font?: string;
  theme?: Theme;
  /**
   * Optional external translation function. When provided, the library will
   * use it instead of its built-in JSON-based translations. This allows
   * seamless integration with i18next or any other i18n library in the
   * consuming project without conflicts or a shared global instance.
   *
   * @example
   * // With react-i18next:
   * const { t } = useTranslation();
   * <MotifProvider t={t}>...</MotifProvider>
   */
  t?: LibraryTranslateFn;
};

export type MotifContextProps = {
  locale: Locale;
  baseIconClass: string;
  componentDefaults: ComponentDefaults;
  theme?: Theme;
  t: LibraryTranslateFn;
  setComponentDefaults: (defaults: ComponentDefaults) => void;
  setLocale: (locale: Locale) => void;
  setBaseIconClass: (iconClass: string) => void;
  setFont: (font: string) => void;
  setTheme: (theme: Theme) => void;
};

export type ColorMode = "dark" | "light";

export type { Locale };

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
