import styles from "../../DatePicker.module.scss";
import { useCallback, useContext } from "react";
import { DatePickerContext, DatePickerProvider } from "../../context/DatePickerProvider";
import DaySelectorWithMonthYear from "@/components/DatePicker/components/DateSelector/Day/DaySelectorWithMonthYear";
import MonthSelector from "@/components/DatePicker/components/DateSelector/MonthYear/MonthSelector";
import YearSelector from "@/components/DatePicker/components/DateSelector/MonthYear/YearSelector";
import PickerActions from "@/components/Motif/Pickers/components/PickerActions";
import { sanitizeModuleClasses } from "../../../../../utils/cssUtils";
import { DatePickerProviderProps } from "../../types";

type DateSelectorProps = DatePickerProviderProps & {
  removeActionButtons?: boolean;
  onOkClick?: (date?: Date) => void;
};

const DateSelectorContent = () => {
  const { picker, size, fluid } = useContext(DatePickerContext);
  const classes = sanitizeModuleClasses(styles, "dateSelector", size, fluid && "fluid");

  return (
    <div className={classes}>
      {picker === "day" ? <DaySelectorWithMonthYear /> : picker === "month" ? <MonthSelector /> : <YearSelector />}
    </div>
  );
};

const DateSelectorActions = ({ onOkClick }: { onOkClick?: (date?: Date) => void }) => {
  const { size, clearDatePicker, selectedDate } = useContext(DatePickerContext);
  const okClickHandler = useCallback(() => onOkClick?.(selectedDate), [onOkClick, selectedDate]);

  return <PickerActions onOkClick={okClickHandler} size={size} onClearClick={clearDatePicker} />;
};

const DateSelector = (props: DateSelectorProps) => {
  const { removeActionButtons, onOkClick, ...providerProps } = props;

  return (
    <DatePickerProvider {...providerProps}>
      <DateSelectorContent />
      {!removeActionButtons && <DateSelectorActions onOkClick={onOkClick} />}
    </DatePickerProvider>
  );
};

export default DateSelector;
