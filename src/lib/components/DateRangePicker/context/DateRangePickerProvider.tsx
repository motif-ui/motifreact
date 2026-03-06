"use client";

import { createContext, PropsWithChildren, useCallback, useMemo, useState } from "react";
import {
  datePickerContextDefaultValues,
  DateRangePickerContextProps,
  DateRangePickerProviderProps,
} from "@/components/DateRangePicker/types";
import { orderDatesAndPutTimes } from "@/components/DateRangePicker/helper";
import { DateUtils } from "../../../../utils/dateUtils";
import { calculateWeeksFlat } from "@/components/DatePicker/components/helper";

export const DateRangePickerContext = createContext<DateRangePickerContextProps>(datePickerContextDefaultValues);

export const DateRangePickerProvider = (props: PropsWithChildren<DateRangePickerProviderProps>) => {
  const { value, locale, size, onDateChange, children } = props;

  const getDaysOfMonth = useCallback((month: Date) => calculateWeeksFlat(month, locale.firstDayOfWeek), [locale.firstDayOfWeek]);
  const today = useMemo(() => DateUtils.getTodayTimeless(), []);
  const initialMonths = useMemo(
    () => [
      getDaysOfMonth(DateUtils.getDateOfPrevMonth()),
      getDaysOfMonth(today),
      getDaysOfMonth(DateUtils.getDateOfNextMonth()),
      getDaysOfMonth(DateUtils.getDateOfNextMonth(DateUtils.getDateOfNextMonth())),
    ],
    [getDaysOfMonth, today],
  );
  const [dateCouple, setDateCouple] = useState<(Date | undefined)[]>(value ? orderDatesAndPutTimes(value) : [undefined, undefined]);
  const _getMonthsOfTheValue = useCallback(() => {
    if (!value || value.length !== 2 || value.some(d => !d)) return initialMonths;

    const [start] = orderDatesAndPutTimes(value);
    return [
      getDaysOfMonth(DateUtils.getDateOfPrevMonth(start)),
      getDaysOfMonth(start!),
      getDaysOfMonth(DateUtils.getDateOfNextMonth(start)),
      getDaysOfMonth(DateUtils.getDateOfNextMonth(DateUtils.getDateOfNextMonth(start))),
    ];
  }, [getDaysOfMonth, initialMonths, value]);
  const [months, setMonths] = useState<Date[][]>(_getMonthsOfTheValue());
  const [sliding, setSliding] = useState<"slideLeft" | "slideRight">();
  const partialSelection = useMemo(() => {
    const selectedDates = dateCouple.filter(d => !!d);
    return selectedDates.length === 1 ? selectedDates[0] : undefined;
  }, [dateCouple]);

  const contextValue: DateRangePickerContextProps = useMemo(
    () => ({
      locale,
      size,
      dateCouple,
      setDateCouple,
      sliding,
      setSliding,
      setMonths,
      months,
      today,
      onDateChange,
      getDaysOfMonth,
      initialMonths,
      partialSelection,
    }),
    [locale, size, dateCouple, sliding, months, today, onDateChange, getDaysOfMonth, initialMonths, partialSelection],
  );

  return <DateRangePickerContext value={contextValue}>{children}</DateRangePickerContext>;
};
