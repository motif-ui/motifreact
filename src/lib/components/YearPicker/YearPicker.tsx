"use client";

import { useEffect, useState } from "react";
import Picker from "../Motif/Pickers/Picker";
import Header from "@/components/DatePicker/components/Header/Header";
import YearGrid from "@/components/DatePicker/components/DateSelector/MonthYear/YearGrid";
import useYearPage from "@/components/DatePicker/components/DateSelector/MonthYear/useYearPage";
import styles from "@/components/DatePicker/DatePicker.module.scss";
import { YearPickerProps } from "./types";
import { PropsWithRef } from "../../types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleClasses } from "../../../utils/cssUtils";

const YearPicker = (props: PropsWithRef<YearPickerProps, HTMLDivElement>) => {
  const {
    size = "md",
    variant = "borderless",
    fluid,
    value,
    onYearChange,
    className,
    style,
    ref,
  } = usePropsWithThemeDefaults("YearPicker", props);
  const [selectedYear, setSelectedYear] = useState(value);
  const displayedYear = selectedYear ?? new Date().getFullYear();
  const { years, showPrevPage, showNextPage } = useYearPage(displayedYear);

  useEffect(() => setSelectedYear(value), [value]);

  const handleYearClick = (year: number) => {
    if (year === selectedYear) return;
    setSelectedYear(year);
    onYearChange?.(year);
  };

  return (
    <Picker size={size} variant={variant} fluid={fluid} ref={ref} style={style} className={`mtf-YearPicker ${className ?? ""}`.trim()}>
      <div className={sanitizeModuleClasses(styles, "dateSelector", size, fluid && "fluid")}>
        <Header size={size} year={`${displayedYear}`} onPrevClick={showPrevPage} onNextClick={showNextPage} disableButtons />
        <hr className={styles.divider} />
        <YearGrid years={years} selectedYear={selectedYear} onYearClick={handleYearClick} />
      </div>
    </Picker>
  );
};

YearPicker.displayName = "YearPicker";
export default YearPicker;
