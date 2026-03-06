"use client";

import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { datePickerContextDefaultValues, DatePickerContextProps, DatePickerProviderProps, DatePickerPickerType } from "../types";
import { DateUtils } from "../../../../utils/dateUtils";

export const DatePickerContext = createContext<DatePickerContextProps>(datePickerContextDefaultValues);

export const DatePickerProvider = (props: PropsWithChildren<DatePickerProviderProps>) => {
  const { children, value, size, locale, fluid, onDateChange, onPickerChange, onClearClick } = props;

  const [picker, setPicker] = useState<DatePickerPickerType>("day");
  const [previousTab, setPreviousTab] = useState<"day" | "month">("day");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(DateUtils.getDateTimeless(value));
  const [pickerDate, setPickerDate] = useState<Date>(DateUtils.getDateTimeless(value) ?? DateUtils.getTodayTimeless());
  const today = useMemo(() => DateUtils.getTodayTimeless(), []);

  useEffect(() => setSelectedDate(value), [value]);

  const onYearMonthTabSelected = useCallback(
    (nextTab: "year" | "month", previousTab: "month" | "day") => {
      setPicker(nextTab);
      onPickerChange?.(nextTab);
      setPreviousTab(previousTab);
    },
    [onPickerChange],
  );

  const clearDatePicker = useCallback(() => {
    if (selectedDate) {
      setPickerDate(DateUtils.getTodayTimeless());
      onDateChange?.(undefined);
    }
    setSelectedDate(undefined);
    onClearClick?.();
  }, [onClearClick, onDateChange, selectedDate]);

  const contextValue: DatePickerContextProps = useMemo(
    () => ({
      size,
      pickerDate,
      selectedDate,
      previousTab,
      clearDatePicker,
      picker,
      locale,
      setPickerDate,
      onYearMonthTabSelected,
      fluid,
      today,
      setSelectedDate,
      setPicker,
      onDateChange,
      onPickerChange,
    }),
    [
      clearDatePicker,
      fluid,
      locale,
      today,
      onDateChange,
      onPickerChange,
      onYearMonthTabSelected,
      picker,
      pickerDate,
      previousTab,
      selectedDate,
      size,
    ],
  );

  return <DatePickerContext value={contextValue}>{children}</DatePickerContext>;
};
