import DateSelector from "@/components/DatePicker/components/DateSelector/DateSelector";
import PickerActions from "@/components/Motif/Pickers/components/PickerActions";
import { useCallback, useContext } from "react";
import { DatePickerContext } from "@/components/DatePicker/context/DatePickerProvider";

type Props = {
  removeActionButtons?: boolean;
  onOkClick?: (date?: Date) => void;
};

const DatePickerContainer = (props: Props) => {
  const { removeActionButtons, onOkClick } = props;
  const { size, clearDatePicker, selectedDate } = useContext(DatePickerContext);

  const okClickHandler = useCallback(() => onOkClick?.(selectedDate), [onOkClick, selectedDate]);

  return (
    <>
      <DateSelector />
      {!removeActionButtons && <PickerActions onOkClick={okClickHandler} size={size} onClearClick={clearDatePicker} />}
    </>
  );
};

export default DatePickerContainer;
