import Dropdown from "@/components/Dropdown";
import { useCallback, useContext, useMemo, useState } from "react";
import { DateRangePickerContext } from "@/components/DateRangePicker/context/DateRangePickerProvider";
import { useMotifContext } from "src/lib/motif/context/MotifProvider.tsx";

const days = [1, 7, 30, 180, 365] as const;

const DaysDropdown = () => {
  const { locale, size, setMonths, initialMonths, today, setDateCouple, onDateChange } = useContext(DateRangePickerContext);
  const { t } = useMotifContext();
  const [label, setLabel] = useState(t("g.choosePlease"));

  const changeHandler = useCallback(
    (label: string, days: number) => {
      const prevDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - days + 1);
      setMonths(initialMonths);
      setDateCouple([prevDate, today]);
      onDateChange?.([prevDate, today]);
      setLabel(label);
    },
    [initialMonths, onDateChange, setDateCouple, setMonths, today],
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

  return <Dropdown size={size} items={items} variant="secondary" label={label} />;
};

export default DaysDropdown;
