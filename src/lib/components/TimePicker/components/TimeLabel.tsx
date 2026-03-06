import styles from "../TimePicker.module.scss";
import { useContext } from "react";
import { TimePickerContext } from "@/components/TimePicker/context/TimePickerProvider";
import { twoDigits, convert24To12Hour } from "@/components/Motif/Pickers/helper";

const TimeLabel = () => {
  const { time, secondsEnabled, format } = useContext(TimePickerContext);
  const { hours, minutes, seconds } = time ?? {};

  const hoursToShow = !hours && hours !== 0 ? "__" : twoDigits(format === "12h" ? convert24To12Hour(hours) : hours);

  return (
    <div className={styles.timeLabel} data-testid="timeInfo">
      <span>{hoursToShow}</span>&nbsp;:&nbsp;<span>{twoDigits(minutes) ?? "__"}</span>
      {secondsEnabled && (
        <>
          &nbsp;:&nbsp;<span>{twoDigits(seconds) ?? "__"}</span>
        </>
      )}
    </div>
  );
};

export default TimeLabel;
