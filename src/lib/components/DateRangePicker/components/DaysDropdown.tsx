import Dropdown from "@/components/Dropdown";
import { useCallback, useContext, useMemo, useState } from "react";
import { DateRangePickerContext } from "@/components/DateRangePicker/context/DateRangePickerProvider";
import styles from "@/components/DateRangePicker/DateRangePicker.module.scss";
import { getMonthsAroundDate } from "@/components/DateRangePicker/helper";

const days = [1, 7, 30, 180, 365] as const;

const DaysDropdown = () => {
  const { locale, size, setMonths, today, setDateCouple, onDateChange, getDaysOfMonth } = useContext(DateRangePickerContext);
  const [label, setLabel] = useState(locale.choose);

  const changeHandler = useCallback(
    (label: string, days: number) => {
      const prevDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - days + 1);
      setMonths(getMonthsAroundDate(prevDate, getDaysOfMonth));
      setDateCouple([prevDate, today]);
      onDateChange?.([prevDate, today]);
      setLabel(label);
    },
    [getDaysOfMonth, onDateChange, setDateCouple, setMonths, today],
  );

  const items = useMemo(
    () =>
      days.map(day => {
        const label = day === 1 ? locale.today : `${locale.last} ${day} ${locale.days}`;
        return {
          label,
          action: () => changeHandler(label, day),
        };
      }),
    [changeHandler, locale.days, locale.last, locale.today],
  );

  return <Dropdown size={size} items={items} variant="secondary" label={label} className={styles.rangeSelectDropdown} />;
};

export default DaysDropdown;
