import styles from "../../../DatePicker.module.scss";
import { rotateArray } from "../../../../../../utils/utils";
import { DatePickerLocale } from "@/components/DatePicker/types";
import { useContext } from "react";
import { DatePickerContext } from "@/components/DatePicker/context/DatePickerProvider.tsx";

type Props = {
  locale: DatePickerLocale;
};

const WeekDays = ({ locale }: Props) => {
  const { firstDayOfWeek } = useContext(DatePickerContext);
  return (
    <div className={styles.weekDays}>
      {rotateArray(locale.weekDays, "left", firstDayOfWeek).map(day => (
        <span key={day}>{day}</span>
      ))}
    </div>
  );
};

export default WeekDays;
