"use client";

import { createContext, PropsWithChildren, useContext, useInsertionEffect, useMemo, useState } from "react";
import { DEFAULT_MOTIF_CONTEXT_VALUES, DEFAULT_LOCALE, MOTIF_ICONS_DEFAULT_CLASS } from "../../constants";
import { ComponentDefaults, MotifContextProps, MotifProviderProps, Locale } from "../types/contextProps";
import { convertThemeToCSSVariables } from "../helper";
import { createTranslator } from "../../../i18n/translate";
import { DeepPartial, LocaleShape } from "../../types";

type ParsedLocale = { localeStr: Locale; localeTexts: DeepPartial<LocaleShape> | undefined };

const MotifContext = createContext<MotifContextProps>(DEFAULT_MOTIF_CONTEXT_VALUES);
export const useMotifContext = () => useContext(MotifContext);

function parseLocale(localeProp: MotifProviderProps["locale"]): ParsedLocale {
  if (localeProp === undefined) return { localeStr: DEFAULT_LOCALE, localeTexts: undefined };
  if (typeof localeProp === "string") return { localeStr: localeProp, localeTexts: undefined };
  return { localeStr: localeProp.locale ?? DEFAULT_LOCALE, localeTexts: localeProp.texts };
}

const MotifProvider = (props: PropsWithChildren<MotifProviderProps>) => {
  const { localeStr: initialLocale, localeTexts } = parseLocale(props.locale);

  const [componentDefaults, setComponentDefaults] = useState<ComponentDefaults>(props.componentDefaults || {});
  const [baseIconClass, setBaseIconClass] = useState(props.baseIconClass || MOTIF_ICONS_DEFAULT_CLASS);
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [font, setFont] = useState(props.font);
  const [theme, setTheme] = useState(props.theme);

  const themeCssVariables = useMemo(() => (theme ? convertThemeToCSSVariables(theme) : {}), [theme]);

  useInsertionEffect(() => {
    const root = document.documentElement;

    Object.entries(themeCssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    font && root.style.setProperty("--theme-typography-font-family", font);

    return () => {
      Object.keys(themeCssVariables).forEach(key => {
        root.style.removeProperty(key);
      });
      root.style.removeProperty("--theme-typography-font-family");
    };
  }, [font, themeCssVariables]);

  const value: MotifContextProps = useMemo(
    () => ({
      componentDefaults,
      locale,
      baseIconClass,
      theme,
      // Use the consumer-provided t (e.g. from react-i18next), or fall back to
      // the library's own JSON-based translator. Either way this is scoped to
      // the library — no global i18n instance is touched.
      t: props.t ?? createTranslator(locale, localeTexts),
      setBaseIconClass,
      setComponentDefaults,
      setLocale,
      setFont,
      setTheme,
    }),
    /* Descriptions:
     *  - localeTexts is intentionally not included in deps since it's static config derived from locale prop; locale state drives updates.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseIconClass, componentDefaults, locale, theme, props.t],
  );

  return <MotifContext value={value}>{props.children}</MotifContext>;
};
export default MotifProvider;
