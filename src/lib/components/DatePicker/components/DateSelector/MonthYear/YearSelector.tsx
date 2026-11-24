"use client";

import { useContext } from "react";
import { DatePickerContext } from "@/components/DatePicker/context/DatePickerProvider";
import Header from "@/components/DatePicker/components/Header/Header";
import YearGrid from "./YearGrid";
import useYearPage from "./useYearPage";
import styles from "@/components/DatePicker/DatePicker.module.scss";

const YearSelector = () => {
  const { pickerDate, setPickerDate, setPicker, previousTab, onPickerChange, size } = useContext(DatePickerContext);
  const { years, showPrevPage, showNextPage } = useYearPage(pickerDate.getFullYear());

  const handleYearClick = (year: number) => {
    const newPickerDate = new Date(pickerDate.getTime());
    newPickerDate.setFullYear(year);
    setPickerDate(newPickerDate);
    setPicker(previousTab);
    onPickerChange?.(previousTab);
  };

  return (
    <>
      <Header size={size} year={`${pickerDate.getFullYear()}`} onPrevClick={showPrevPage} onNextClick={showNextPage} disableButtons />
      <hr className={styles.divider} />
      <YearGrid years={years} selectedYear={pickerDate.getFullYear()} onYearClick={handleYearClick} />
    </>
  );
};

export default YearSelector;
