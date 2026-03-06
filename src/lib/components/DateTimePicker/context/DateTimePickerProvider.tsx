"use client";

import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { ActiveTab, DateTimePickerContextProps, DateTimePickerProviderProps } from "@/components/DateTimePicker/types";
import { Time, TimePeriod } from "@/components/TimePicker/types";
import { DateUtils } from "../../../../utils/dateUtils";
import { getPeriodOfTime } from "@/components/TimePicker/helper";

export const DateTimePickerContext = createContext<DateTimePickerContextProps | undefined>(undefined);

export const DateTimePickerProvider = (props: PropsWithChildren<DateTimePickerProviderProps>) => {
  const { children, size, value, onDateChange, onTimeChange, locale, secondsEnabled, timeFormat, fluid, onClearClick } = props;

  const [activeTab, setActiveTab] = useState<ActiveTab>("date");
  const [selectedValue, setSelectedValue] = useState<Date | undefined>(value);
  const initialTime = value ? { hours: value.getHours(), minutes: value.getMinutes(), seconds: value.getSeconds() } : undefined;
  const [currentTime, setCurrentTime] = useState<Time | undefined>(initialTime);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<TimePeriod | undefined>(getPeriodOfTime(initialTime, timeFormat));

  useEffect(() => {
    setSelectedValue(value);
    const newCurrentTime = value ? { hours: value.getHours(), minutes: value.getMinutes(), seconds: value.getSeconds() } : undefined;
    setCurrentTime(newCurrentTime);
    setSelectedTimePeriod(getPeriodOfTime(newCurrentTime, timeFormat));
  }, [timeFormat, value]);

  const clearDateTimePicker = useCallback(() => {
    selectedValue && onDateChange?.(undefined);
    setSelectedValue(undefined);
    currentTime && onTimeChange?.(undefined);
    setCurrentTime(undefined);
    onClearClick?.();
  }, [currentTime, onClearClick, onDateChange, onTimeChange, selectedValue]);

  const dateChangeHandler = useCallback(
    (date?: Date) => {
      const newValue = DateUtils.getDateWithTime(date, currentTime);
      if (newValue?.getTime() !== selectedValue?.getTime()) {
        setTimeout(() => setSelectedValue(newValue));
        onDateChange?.(newValue);
        if (date && !currentTime) {
          setActiveTab("time");
          setTimeout(() => setCurrentTime({ hours: 0, minutes: 0, seconds: 0 }));
        }
      }
    },
    [currentTime, onDateChange, selectedValue],
  );

  const timeChangeHandler = useCallback(
    (time?: Time) => {
      selectedValue && setSelectedValue(prev => DateUtils.getDateWithTime(prev, time));
      setCurrentTime(time);
      onTimeChange?.(time);
    },
    [onTimeChange, selectedValue],
  );

  const contextValue: DateTimePickerContextProps = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      size,
      locale,
      selectedValue,
      setSelectedValue,
      selectedTimePeriod,
      setSelectedTimePeriod,
      currentTime,
      secondsEnabled,
      clearDateTimePicker,
      dateChangeHandler,
      timeChangeHandler,
      timeFormat,
      fluid,
    }),
    [
      activeTab,
      clearDateTimePicker,
      currentTime,
      dateChangeHandler,
      fluid,
      locale,
      secondsEnabled,
      selectedTimePeriod,
      selectedValue,
      size,
      timeChangeHandler,
      timeFormat,
    ],
  );
  return <DateTimePickerContext value={contextValue}>{children}</DateTimePickerContext>;
};
