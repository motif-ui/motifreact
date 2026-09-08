import { useContext } from "react";
import TimeLabel from "@/components/TimePicker/components/TimeLabel";
import TimeSelector from "@/components/TimePicker/components/TimeSelector/TimeSelector";
import TimePeriodSelector from "@/components/TimePicker/components/TimePeriodSelector";
import { TimePickerContext } from "@/components/TimePicker/context/TimePickerProvider";
import styles from "../TimePicker.module.scss";
import { StandardProps } from "../../../types";
import { sanitizeModuleClassesWithOptions } from "src/utils/cssUtils.ts";

type Props = {
  removeLabel?: boolean;
} & StandardProps;

const TimePickerContent = (props: Props) => {
  const { removeLabel, className } = props;
  const { size, timePeriod } = useContext(TimePickerContext);
  const classes = sanitizeModuleClassesWithOptions(styles, { externalClasses: [className] }, size);

  return (
    <div className={classes}>
      {!removeLabel && <TimeLabel />}
      <TimeSelector />
      {timePeriod && <TimePeriodSelector />}
    </div>
  );
};

export default TimePickerContent;
