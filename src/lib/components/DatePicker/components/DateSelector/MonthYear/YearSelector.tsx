"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { DatePickerContext } from "@/components/DatePicker/context/DatePickerProvider";
import { calculateYears } from "@/components/DatePicker/components/helper";
import Header from "@/components/DatePicker/components/Header/Header";
import MonthYearButton from "./MonthYearButton";
import styles from "@/components/DatePicker/DatePicker.module.scss";

const YearSelector = () => {
  const { pickerDate, setPickerDate, setPicker, previousTab, onPickerChange, size } = useContext(DatePickerContext);
  const [years, setYears] = useState<number[]>([]);
  const displayedYearsCount = 16;

  useEffect(() => {
    setYears(calculateYears(pickerDate.getFullYear() - displayedYearsCount / 2, pickerDate.getFullYear() + displayedYearsCount / 2));
  }, [pickerDate]);

  const prevClickHandler = useCallback(() => {
    setYears(calculateYears(years[0] - displayedYearsCount, years[0]));
  }, [years]);

  const nextClickHandler = useCallback(() => {
    setYears(calculateYears(years[years.length - 1] + 1, years[years.length - 1] + displayedYearsCount + 1));
  }, [years]);

  const handleYearClick = (year: number) => {
    const newPickerDate = new Date(pickerDate.getTime());
    newPickerDate.setFullYear(year);
    setPickerDate(newPickerDate);
    setPicker(previousTab);
    onPickerChange?.(previousTab);
  };

  return (
    <>
      <Header
        size={size}
        year={`${pickerDate.getFullYear()}`}
        onPrevClick={prevClickHandler}
        onNextClick={nextClickHandler}
        disableButtons
      />
      <hr className={styles.divider} />
      <div className={styles.yearSelector} data-testid="DatePickerYearsContainer">
        {years.map(year => (
          <MonthYearButton label={year} onClick={() => handleYearClick(year)} selected={year === pickerDate.getFullYear()} key={year} />
        ))}
      </div>
    </>
  );
};

export default YearSelector;
