import { useContext } from "react";
import styles from "../TimePicker.module.scss";
import { TimePickerContext } from "../context/TimePickerProvider";
import { TimePeriod } from "@/components/TimePicker/types";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

const periods: TimePeriod[] = ["am", "pm"] as const;

const TimePeriodSelector = () => {
  const { timePeriod, changeTimePeriod, locale } = useContext(TimePickerContext);

  return (
    <div className={styles.periodSelector} data-testid="timePeriodSelector">
      {periods.map(period => {
        const buttonClasses = sanitizeModuleClasses(styles, period === timePeriod && "selected");

        return (
          <button key={period} className={buttonClasses} onClick={() => changeTimePeriod(period)} type="button">
            {locale[period]}
          </button>
        );
      })}
    </div>
  );
};

export default TimePeriodSelector;
