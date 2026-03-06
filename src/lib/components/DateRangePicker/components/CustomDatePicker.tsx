import { useCallback, useContext, RefObject } from "react";
import { DateRangePickerContext } from "@/components/DateRangePicker/context/DateRangePickerProvider";
import { DateUtils } from "../../../../utils/dateUtils";
import Day from "@/components/DatePicker/components/DateSelector/Day/Day";
import { MIDDLE_OF_THE_MONTH, orderDatesAndPutTimes } from "@/components/DateRangePicker/helper";
import DaySelector from "@/components/DatePicker/components/DateSelector/Day/DaySelector";

type Props = {
  order: number;
  daysRef?: RefObject<HTMLDivElement | null>;
};

const CustomDatePicker = (props: Props) => {
  const { order, daysRef } = props;
  const {
    size,
    locale,
    dateCouple: [startDate, endDate],
    today,
    months,
    setDateCouple,
    onDateChange,
    partialSelection,
    setSliding,
    setMonths,
    getDaysOfMonth,
  } = useContext(DateRangePickerContext);

  const onDateClick = useCallback(
    (date: Date) => {
      const updatedDates = partialSelection ? orderDatesAndPutTimes([partialSelection, date]) : [new Date(date), undefined];
      setDateCouple(updatedDates);
      onDateChange?.(updatedDates);
    },
    [onDateChange, partialSelection, setDateCouple],
  );

  const pickerDate = months[order][MIDDLE_OF_THE_MONTH];

  const renderDay = useCallback(
    (date: Date) => {
      const pickerMonth = pickerDate.getMonth();
      const isBetween = startDate && endDate && date > startDate && date < endDate;
      const isToday = DateUtils.areEqualDates(date, today) && date.getMonth() === pickerMonth;
      const pastOrFuture = date.getMonth() !== pickerMonth;

      const selectedStart = DateUtils.areEqualDates(date, startDate);
      const selectedEnd = DateUtils.areEqualDates(date, endDate);
      const selected = selectedStart || selectedEnd;
      const rangeAvailable = startDate && endDate;
      const selectDirection =
        rangeAvailable && selectedEnd !== selectedStart
          ? selectedStart && date < endDate
            ? "toRight"
            : selectedEnd && date > startDate
              ? "toLeft"
              : undefined
          : undefined;

      return (
        <Day
          date={date}
          selected={selected}
          selectDirection={selectDirection}
          partiallySelected={isBetween}
          key={date.getTime() + "_" + pickerMonth}
          today={isToday}
          invisible={pastOrFuture}
          onClick={onDateClick}
        />
      );
    },
    [endDate, onDateClick, pickerDate, startDate, today],
  );

  const onPrevClick = useCallback(() => {
    setSliding("slideRight");
    const month0 = getDaysOfMonth(DateUtils.getDateOfPrevMonth(months[0][15]));
    setTimeout(() => {
      setMonths([month0, months[0], months[1], months[2]]);
      setSliding(undefined);
    }, 300);
  }, [getDaysOfMonth, months, setMonths, setSliding]);

  const onNextClick = useCallback(() => {
    setSliding("slideLeft");
    const month3 = getDaysOfMonth(DateUtils.getDateOfNextMonth(months[3][MIDDLE_OF_THE_MONTH]));
    setTimeout(() => {
      setMonths([months[1], months[2], months[3], month3]);
      setSliding(undefined);
    }, 300);
  }, [getDaysOfMonth, months, setMonths, setSliding]);

  return (
    <DaySelector
      size={size}
      locale={locale}
      month={pickerDate.getMonth()}
      year={pickerDate.getFullYear()}
      disabledMonthYearClick
      daysRef={daysRef}
      renderDay={renderDay}
      dates={months[order]}
      onPrevClick={order === 1 ? onPrevClick : undefined}
      onNextClick={order === 2 ? onNextClick : undefined}
    />
  );
};

export default CustomDatePicker;
