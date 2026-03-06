import styles from "../../TimePicker.module.scss";

import { memo, useContext } from "react";
import { HOURS, HOURS12, MINUTES, SECONDS } from "@/components/Motif/Pickers/helper";
import { TimePickerContext } from "../../context/TimePickerProvider";
import TimeHeader from "@/components/TimePicker/components/TimeSelector/TimeHeader";
import TimeStripe from "@/components/TimePicker/components/TimeSelector/TimeStripe";

const TimeSelector = memo(() => {
  const { secondsEnabled, format } = useContext(TimePickerContext);

  return (
    <>
      <TimeHeader />
      <div className={styles.stripeContainer} data-testid="timeStripeContainer">
        <TimeStripe type="hours" numbers={format === "12h" ? HOURS12 : HOURS} />
        <TimeStripe type="minutes" numbers={MINUTES} />
        {secondsEnabled && <TimeStripe type="seconds" numbers={SECONDS} />}
      </div>
    </>
  );
});

export default TimeSelector;
