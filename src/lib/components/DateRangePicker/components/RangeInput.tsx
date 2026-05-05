import InputText from "@/components/InputText";
import useOutsideClick from "../../../hooks/useOutsideClick";
import { useCallback, useContext, useEffect, useId, useState } from "react";
import { DateRangePickerContext } from "@/components/DateRangePicker/context/DateRangePickerProvider";
import { InputValue } from "@/components/Form/types";
import { formatDate, parseDate } from "@/components/InputDate/helper";
import { MIDDLE_OF_THE_MONTH, orderDatesAndPutTimes } from "@/components/DateRangePicker/helper";
import { DateUtils } from "../../../../utils/dateUtils";
import MotifIcon from "@/components/Motif/Icon/MotifIcon";
import { DateFormat } from "../../Motif/Pickers/types";

const dateFormat: DateFormat = {
  order: ["day", "month", "year"],
  delimiter: "/",
  dayFormat: "DD",
  monthFormat: "MM",
  yearFormat: "YYYY",
};

type Props = {
  index: 0 | 1;
};

const RangeInput = (props: Props) => {
  const { locale } = useContext(DateRangePickerContext);
  const { index } = props;
  const { size, dateCouple, onDateChange, setDateCouple, getDaysOfMonth, months, setMonths } = useContext(DateRangePickerContext);
  const uniqueName = useId();

  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setValue(formatDate(dateCouple[index], dateFormat, locale));
  }, [dateCouple, index, locale]);

  const ref = useOutsideClick<HTMLInputElement>(() => {
    setValue(formatDate(dateCouple[index], dateFormat, locale));
  });

  const onChange = useCallback(
    (value: InputValue) => {
      const date = parseDate(value as string, dateFormat, locale);
      if (!date) {
        setValue(value as string);
        return;
      }

      setDateCouple(([start, end] = []) => {
        const orderedDates = orderDatesAndPutTimes(index === 0 ? [date, end] : [start, date]);
        onDateChange?.(orderedDates);
        return orderedDates;
      });
      if (!DateUtils.isInTheMonth(date, months[1][MIDDLE_OF_THE_MONTH]) && !DateUtils.isInTheMonth(date, months[2][MIDDLE_OF_THE_MONTH])) {
        const middleItems = [
          getDaysOfMonth(DateUtils.getDateOfPrevMonth(date)),
          getDaysOfMonth(date),
          getDaysOfMonth(DateUtils.getDateOfNextMonth(date)),
        ];
        setMonths(
          index === 0
            ? [...middleItems, getDaysOfMonth(DateUtils.getDateOfNextMonth(DateUtils.getDateOfNextMonth(date)))]
            : [getDaysOfMonth(DateUtils.getDateOfPrevMonth(DateUtils.getDateOfPrevMonth(date))), ...middleItems],
        );
      }
    },
    [getDaysOfMonth, index, locale, months, onDateChange, setDateCouple, setMonths],
  );

  return (
    <InputText
      ref={ref}
      name={uniqueName}
      size={size}
      iconLeft={<MotifIcon name="calendar_month" />}
      placeholder="__ / __ / ____"
      maxLength={10}
      value={value}
      onChange={onChange}
    />
  );
};

export default RangeInput;
