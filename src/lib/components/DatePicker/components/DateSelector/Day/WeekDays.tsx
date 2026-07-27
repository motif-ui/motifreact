import styles from "../../../DatePicker.module.scss";
import { rotateArray } from "../../../../../../utils/utils";
import { DatePickerLocale } from "@/components/DatePicker/types";
import { DaysOfWeek } from "@/components/Motif/Pickers/types";

type Props = {
  locale: DatePickerLocale;
  firstDayOfWeek: DaysOfWeek;
};

const WeekDays = ({ locale, firstDayOfWeek }: Props) => {
  return (
    <div className={styles.weekDays}>
      {rotateArray(locale.weekDays, "left", firstDayOfWeek).map(day => (
        <span key={day}>{day}</span>
      ))}
    </div>
  );
};

export default WeekDays;
