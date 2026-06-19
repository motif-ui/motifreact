import styles from "../../TimePicker.module.scss";
import { useContext } from "react";
import { TimePickerContext } from "@/components/TimePicker/context/TimePickerProvider";

const TimeHeader = () => {
  const { locale, secondsEnabled } = useContext(TimePickerContext);

  return (
    <div className={styles.abbrContainer}>
      <span>{locale.hoursAbbr}</span>
      <span>{locale.minutesAbbr}</span>
      {secondsEnabled && <span>{locale.secondsAbbr}</span>}
    </div>
  );
};

export default TimeHeader;
