import { useCallback, useContext } from "react";
import TimeLabel from "@/components/TimePicker/components/TimeLabel";
import TimeSelector from "@/components/TimePicker/components/TimeSelector/TimeSelector";
import TimePeriodSelector from "@/components/TimePicker/components/TimePeriodSelector";
import { TimePickerContext } from "@/components/TimePicker/context/TimePickerProvider";
import { Time } from "@/components/TimePicker/types";
import PickerActions from "@/components/Motif/Pickers/components/PickerActions";
import styles from "../TimePicker.module.scss";
import { StandardProps } from "../../../types";

type Props = {
  onOkClick?: (time?: Time) => void;
  removeActionButtons?: boolean;
  removeLabel?: boolean;
} & StandardProps;

const TimePickerContainer = (props: Props) => {
  const { onOkClick, removeLabel, removeActionButtons, className } = props;
  const { size, resetTime, time, timePeriod } = useContext(TimePickerContext);

  const okClickHandler = useCallback(() => onOkClick?.(time), [onOkClick, time]);

  return (
    <div className={`${styles[size]} ${className ?? ""}`.trim()}>
      {!removeLabel && <TimeLabel />}
      <TimeSelector />
      {timePeriod && <TimePeriodSelector />}
      {!removeActionButtons && <PickerActions size={size} onOkClick={okClickHandler} onClearClick={resetTime} spread />}
    </div>
  );
};

export default TimePickerContainer;
