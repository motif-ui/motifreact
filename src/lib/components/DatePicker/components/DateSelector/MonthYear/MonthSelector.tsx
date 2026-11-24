"use client";

import styles from "../../../DatePicker.module.scss";
import { useCallback, useContext, useState } from "react";
import { DatePickerContext } from "@/components/DatePicker/context/DatePickerProvider";
import Header from "@/components/DatePicker/components/Header/Header";
import MonthGrid from "./MonthGrid";

const MonthSelector = () => {
  const { pickerDate, setPickerDate, setPicker, locale, onPickerChange, size } = useContext(DatePickerContext);
  const [activeDate] = useState(pickerDate);

  const prevClickHandler = useCallback(() => {
    setPickerDate(new Date(pickerDate.getFullYear() - 1, pickerDate.getMonth()));
  }, [pickerDate, setPickerDate]);

  const nextClickHandler = useCallback(() => {
    setPickerDate(new Date(pickerDate.getFullYear() + 1, pickerDate.getMonth()));
  }, [pickerDate, setPickerDate]);

  const handleMonthClick = (month: number) => {
    const newPickerDate = new Date(pickerDate.getTime());
    newPickerDate.setMonth(month);
    setPickerDate(newPickerDate);
    setPicker("day");
    onPickerChange?.("day");
  };

  return (
    <>
      <Header size={size} year={pickerDate.getFullYear().toString()} onPrevClick={prevClickHandler} onNextClick={nextClickHandler} />
      <hr className={styles.divider} />
      <MonthGrid
        monthsShort={locale.monthsShort}
        selectedMonth={pickerDate.getFullYear() === activeDate.getFullYear() ? pickerDate.getMonth() : undefined}
        onMonthClick={handleMonthClick}
      />
    </>
  );
};

export default MonthSelector;
