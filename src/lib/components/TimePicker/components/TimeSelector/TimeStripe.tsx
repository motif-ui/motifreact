"use client";

import styles from "../../TimePicker.module.scss";
import TimeItem from "./TimeItem";
import { useCallback, useContext, useEffect, useRef } from "react";
import { TimePickerContext } from "../../context/TimePickerProvider";
import { hourEqualPeriodInsensitive } from "@/components/TimePicker/helper";
import { convert24To12Hour, twoDigits } from "@/components/Motif/Pickers/helper";
import { TimeType } from "@/components/TimePicker/types";

type Props = {
  type: TimeType;
  numbers: readonly number[];
};

const TimeStripe = (props: Props) => {
  const { type, numbers } = props;
  const { time, setTimeItem, timePeriod, format } = useContext(TimePickerContext);
  const ref = useRef<HTMLUListElement>(null);
  const stripeTime = time?.[type];

  useEffect(() => {
    if (stripeTime !== undefined && time?.[type] && ref.current) {
      const hourSafeTime = type === "hours" && format === "12h" ? convert24To12Hour(time[type]) : time[type];

      const targetLi = Array.from(ref.current.children).find(
        li => li.firstElementChild?.textContent === twoDigits(hourSafeTime),
      ) as HTMLLIElement;

      const { top: ulTop } = ref.current.getBoundingClientRect();
      const { top: liTop } = targetLi.getBoundingClientRect();

      ref.current.scrollTo({
        top: ref.current.scrollTop + (liTop - ulTop) - 4,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format]);

  const clickHandler = useCallback((value: number) => setTimeItem(type, value), [setTimeItem, type]);
  const isSelected = (n: number) => (type === "hours" ? hourEqualPeriodInsensitive(stripeTime, n, timePeriod) : stripeTime === n);

  return (
    <ul ref={ref} className={styles.timeStripe}>
      {numbers.map(number => (
        <TimeItem value={number} onClick={clickHandler} selected={isSelected(number)} key={number} />
      ))}
    </ul>
  );
};

export default TimeStripe;
