"use client";

import styles from "../../../DatePicker.module.scss";
import { useCallback, useContext, useMemo, useState } from "react";
import { DatePickerContext } from "@/components/DatePicker/context/DatePickerProvider";
import Header from "@/components/DatePicker/components/Header/Header";
import MonthYearButton from "./MonthYearButton";
import { useMotifContext } from "src/lib/motif/context/MotifProvider.tsx";
import { getDateLocale } from "src/i18n/locales/dateLocals.ts";

const MonthSelector = () => {
  const { pickerDate, setPickerDate, setPicker, locale: contextLocale, onPickerChange, size } = useContext(DatePickerContext);

  const { t } = useMotifContext();
  const locale = useMemo(() => contextLocale ?? getDateLocale(t), [contextLocale, t]);

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
      <div className={styles.monthSelector} data-testid="DatePickerMonthsContainer">
        {locale.months.map((_, mIndex) => (
          <MonthYearButton
            key={mIndex}
            label={locale.monthsShort[mIndex]}
            onClick={() => handleMonthClick(mIndex)}
            selected={pickerDate.getMonth() === mIndex && pickerDate.getFullYear() === activeDate.getFullYear()}
          />
        ))}
      </div>
    </>
  );
};

export default MonthSelector;
