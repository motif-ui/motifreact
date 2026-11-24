"use client";

import { useEffect, useState } from "react";
import Picker from "../Motif/Pickers/Picker";
import MonthGrid from "@/components/DatePicker/components/DateSelector/MonthYear/MonthGrid";
import styles from "@/components/DatePicker/DatePicker.module.scss";
import { MonthPickerProps } from "./types";
import { PropsWithRef } from "../../types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleClasses } from "../../../utils/cssUtils";
import { useDateLocale } from "src/i18n/useDateLocale.ts";

const MonthPicker = (props: PropsWithRef<MonthPickerProps, HTMLDivElement>) => {
  const {
    size = "md",
    variant = "borderless",
    fluid,
    value,
    onMonthChange,
    locale: propsLocale,
    className,
    style,
    ref,
  } = usePropsWithThemeDefaults("MonthPicker", props);
  const locale = useDateLocale(propsLocale);
  const [selectedMonth, setSelectedMonth] = useState(value);

  useEffect(() => setSelectedMonth(value), [value]);

  const handleMonthClick = (month: number) => {
    if (month === selectedMonth) return;
    setSelectedMonth(month);
    onMonthChange?.(month);
  };

  return (
    <Picker size={size} variant={variant} fluid={fluid} ref={ref} style={style} className={`mtf-MonthPicker ${className ?? ""}`.trim()}>
      <div className={sanitizeModuleClasses(styles, "dateSelector", size, fluid && "fluid")}>
        <MonthGrid monthsShort={locale.monthsShort} selectedMonth={selectedMonth} onMonthClick={handleMonthClick} />
      </div>
    </Picker>
  );
};

MonthPicker.displayName = "MonthPicker";
export default MonthPicker;
