import { useCallback, useContext } from "react";
import Header from "@/components/DatePicker/components/Header/Header";
import { DatePickerContext } from "@/components/DatePicker/context/DatePickerProvider";

const DayHeader = () => {
  const { locale, pickerDate, setPickerDate, size } = useContext(DatePickerContext);

  const prevClickHandler = useCallback(() => {
    setPickerDate(new Date(pickerDate.getFullYear(), pickerDate.getMonth() - 1));
  }, [pickerDate, setPickerDate]);

  const nextClickHandler = useCallback(() => {
    setPickerDate(new Date(pickerDate.getFullYear(), pickerDate.getMonth() + 1));
  }, [pickerDate, setPickerDate]);

  return (
    <Header
      month={locale.months[pickerDate.getMonth()]}
      year={pickerDate.getFullYear().toString()}
      onPrevClick={prevClickHandler}
      onNextClick={nextClickHandler}
      size={size}
    />
  );
};

export default DayHeader;
