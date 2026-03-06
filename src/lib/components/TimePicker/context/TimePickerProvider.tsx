"use client";

import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { Time, timeContextDefaultValues, TimeContextProps, TimePeriod, TimePickerProviderProps, TimeType } from "../types";
import { getPeriodOfTime } from "@/components/TimePicker/helper";
import { convertTo24Hour } from "@/components/Motif/Pickers/helper";

export const TimePickerContext = createContext<TimeContextProps>(timeContextDefaultValues);

export const TimePickerProvider = (props: PropsWithChildren<TimePickerProviderProps>) => {
  const { children, secondsEnabled, size, locale, onTimeChange, value, format, onClearClick, onPeriodChange } = props;
  const [time, setTime] = useState<Time | undefined>(value);
  const [timePeriod, setTimePeriod] = useState<TimePeriod | undefined>(getPeriodOfTime(time, format));
  useEffect(() => setTime(value), [value]);
  useEffect(() => {
    setTimePeriod(getPeriodOfTime(time, format));
  }, [format, time]);

  const changeTimePeriod = useCallback(
    (newPeriod: TimePeriod) => {
      if (newPeriod === timePeriod || time?.hours === undefined) {
        return;
      }
      const { hours } = time;
      const newHours = newPeriod === "pm" ? (hours + 12) % 24 : hours % 12;

      setTimePeriod(newPeriod);
      onPeriodChange?.(newPeriod);
      if (hours !== newHours) {
        const newTime = { ...time, hours: newHours };
        setTime(newTime);
        onTimeChange?.(newTime);
      }
    },
    [onPeriodChange, onTimeChange, time, timePeriod],
  );

  const resetTime = useCallback(() => {
    time && onTimeChange?.(undefined);
    setTimePeriod(format === "12h" ? "am" : undefined);
    setTime(undefined);
    onClearClick?.();
  }, [format, onClearClick, onTimeChange, time]);

  const setTimeItem = useCallback(
    (type: TimeType, value?: number) => {
      const newTime = {
        ...time,
        [type]: type === "hours" && timePeriod ? convertTo24Hour(value, timePeriod) : value,
      };
      setTime(newTime);
      onTimeChange?.(newTime);
    },
    [onTimeChange, time, timePeriod],
  );

  const contextValue: TimeContextProps = useMemo(
    () => ({ resetTime, size, time, setTimeItem, secondsEnabled, locale, format, timePeriod, changeTimePeriod }),
    [locale, resetTime, secondsEnabled, setTimeItem, size, time, format, timePeriod, changeTimePeriod],
  );

  return <TimePickerContext value={contextValue}>{children}</TimePickerContext>;
};
