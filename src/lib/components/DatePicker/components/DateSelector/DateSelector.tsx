import styles from "../../DatePicker.module.scss";
import { useContext } from "react";
import { DatePickerContext } from "../../context/DatePickerProvider";
import DaySelectorWithMonthYear from "@/components/DatePicker/components/DateSelector/Day/DaySelectorWithMonthYear";
import MonthSelector from "@/components/DatePicker/components/DateSelector/MonthYear/MonthSelector";
import YearSelector from "@/components/DatePicker/components/DateSelector/MonthYear/YearSelector";
import { sanitizeModuleClasses } from "../../../../../utils/cssUtils";

const DateSelector = () => {
  const { picker, size, fluid } = useContext(DatePickerContext);
  const classes = sanitizeModuleClasses(styles, "dateSelector", size, fluid && "fluid");

  return (
    <div className={classes}>
      {picker === "day" ? <DaySelectorWithMonthYear /> : picker === "month" ? <MonthSelector /> : <YearSelector />}
    </div>
  );
};

export default DateSelector;
