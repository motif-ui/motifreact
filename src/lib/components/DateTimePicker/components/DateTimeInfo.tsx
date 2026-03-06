import styles from "../DateTimePicker.module.scss";
import { useContext } from "react";
import { twoDigits, convert24To12Hour } from "@/components/Motif/Pickers/helper";
import { DateTimePickerContext } from "@/components/DateTimePicker/context/DateTimePickerProvider";
import { DateUtils } from "../../../../utils/dateUtils";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

const DateTimeInfo = () => {
  const { locale, selectedValue, secondsEnabled, currentTime, timeFormat, selectedTimePeriod } = useContext(DateTimePickerContext)!;

  const dateToShow = selectedValue || DateUtils.getTodayTimeless();
  const isDateSelected = !!selectedValue;
  const hours = currentTime?.hours;
  const hoursToShow = !hours && hours !== 0 ? "__" : twoDigits(timeFormat === "12h" ? convert24To12Hour(hours) : hours);

  return (
    <div className={styles.info} data-testid="dateTimeInfo">
      <div className={sanitizeModuleClasses(styles, "infoDate", isDateSelected && "active")}>
        <span className={styles.infoMonthDay}>
          {locale.monthsShort[dateToShow.getMonth()]} {dateToShow.getDate()}
        </span>
        <span className={styles.infoYear}>{dateToShow.getFullYear()}</span>
      </div>
      <span className={sanitizeModuleClasses(styles, "infoTime", currentTime && "active")}>
        {hoursToShow}:{twoDigits(currentTime?.minutes) ?? "__"}
        {secondsEnabled && ":" + (twoDigits(currentTime?.seconds) ?? "__")}
      </span>
      {timeFormat === "12h" && <span className={styles.infoTimePeriod}>{locale[selectedTimePeriod ?? "am"]}</span>}
    </div>
  );
};

export default DateTimeInfo;
