"use client";

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DatePickerContext } from "@/components/DatePicker/context/DatePickerProvider";
import { calculateWeeks } from "@/components/DatePicker/components/helper";
import { DateUtils } from "../../../../../../utils/dateUtils";
import Day from "@/components/DatePicker/components/DateSelector/Day/Day";
import DaySelector from "@/components/DatePicker/components/DateSelector/Day/DaySelector";

const DaySelectorWithMonthYear = () => {
  const { size, locale, pickerDate, today, selectedDate, setPickerDate, onDateChange, setSelectedDate } = useContext(DatePickerContext);

  const calculatedWeeks = useMemo(
    () => calculateWeeks(pickerDate.getFullYear(), pickerDate.getMonth(), locale.firstDayOfWeek),
    [pickerDate, locale.firstDayOfWeek],
  );

  const [displayedWeeks, setDisplayedWeeks] = useState<Date[][]>(calculatedWeeks);
  useEffect(() => {
    setDisplayedWeeks(calculatedWeeks);
  }, [calculatedWeeks]);

  const onDayClick = useCallback(
    (date: Date) => {
      selectedDate?.getTime() !== date.getTime() && onDateChange?.(date);
      setSelectedDate(date);
      setPickerDate(date);
    },
    [onDateChange, selectedDate, setPickerDate, setSelectedDate],
  );

  const renderDay = useCallback(
    (date: Date) => {
      const isInPickerMonth = DateUtils.areEqualMonths(date, pickerDate);
      const selected = isInPickerMonth && DateUtils.areEqualDates(date, selectedDate);
      const isToday = isInPickerMonth && DateUtils.areEqualDates(date, today);

      return <Day date={date} onClick={onDayClick} key={date.getTime()} selected={selected} today={isToday} disabled={!isInPickerMonth} />;
    },
    [onDayClick, pickerDate, selectedDate, today],
  );

  const prevClickHandler = useCallback(() => {
    setPickerDate(new Date(pickerDate.getFullYear(), pickerDate.getMonth() - 1));
  }, [pickerDate, setPickerDate]);

  const nextClickHandler = useCallback(() => {
    setPickerDate(new Date(pickerDate.getFullYear(), pickerDate.getMonth() + 1));
  }, [pickerDate, setPickerDate]);

  return (
    <DaySelector
      size={size}
      locale={locale}
      month={pickerDate.getMonth()}
      year={pickerDate.getFullYear()}
      dates={displayedWeeks.flat()}
      renderDay={renderDay}
      onPrevClick={prevClickHandler}
      onNextClick={nextClickHandler}
    />
  );
};

export default DaySelectorWithMonthYear;
