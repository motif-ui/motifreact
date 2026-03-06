"use client";

import { createContext, PropsWithChildren, useContext, useInsertionEffect, useMemo, useState } from "react";
import { DEFAULT_MOTIF_CONTEXT_VALUES, DEFAULT_LOCALE, MOTIF_ICONS_DEFAULT_CLASS } from "../../constants";
import { ComponentDefaults, MotifContextProps, MotifProviderProps, Locale } from "../types/contextProps";
import { convertThemeToCSSVariables } from "../helper";

const MotifContext = createContext<MotifContextProps>(DEFAULT_MOTIF_CONTEXT_VALUES);
export const useMotifContext = () => useContext(MotifContext);

const MotifProvider = (props: PropsWithChildren<MotifProviderProps>) => {
  const [componentDefaults, setComponentDefaults] = useState<ComponentDefaults>(props.componentDefaults || {});
  const [baseIconClass, setBaseIconClass] = useState(props.baseIconClass || MOTIF_ICONS_DEFAULT_CLASS);
  const [locale, setLocale] = useState<Locale>(props.locale || DEFAULT_LOCALE);
  const [font, setFont] = useState(props.font);
  const [theme, setTheme] = useState(props.theme);

  const themeCssVariables = useMemo(() => (theme ? convertThemeToCSSVariables(theme) : {}), [theme]);

  useInsertionEffect(() => {
    const root = document.documentElement;

    // Set theme CSS variables
    Object.entries(themeCssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Set font family
    font && root.style.setProperty("--theme-typography-font-family", font);

    // Cleanup function to remove theme variables when component unmounts
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
      setBaseIconClass,
      setComponentDefaults,
      setLocale,
      setFont,
      setTheme,
    }),
    [baseIconClass, componentDefaults, locale, theme],
  );

  return <MotifContext value={value}>{props.children}</MotifContext>;
};
export default MotifProvider;
