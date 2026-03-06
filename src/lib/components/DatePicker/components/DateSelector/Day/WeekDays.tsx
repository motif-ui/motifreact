import styles from "../../../DatePicker.module.scss";
import { rotateArray } from "../../../../../../utils/utils";
import { DatePickerLocale } from "@/components/DatePicker/types";

type Props = {
  locale: DatePickerLocale;
};

const WeekDays = ({ locale }: Props) => {
  return (
    <div className={styles.weekDays}>
      {rotateArray(locale.weekDays, "left", locale.firstDayOfWeek).map(day => (
        <span key={day}>{day}</span>
      ))}
    </div>
  );
};

export default WeekDays;
