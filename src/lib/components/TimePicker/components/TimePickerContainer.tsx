import { useCallback, useContext } from "react";
import TimePickerContent from "@/components/TimePicker/components/TimePickerContent";
import { TimePickerContext } from "@/components/TimePicker/context/TimePickerProvider";
import { Time } from "@/components/TimePicker/types";
import PickerActions from "@/components/Motif/Pickers/components/PickerActions";

type Props = {
  onOkClick?: (time?: Time) => void;
  removeActionButtons?: boolean;
};

const TimePickerContainer = (props: Props) => {
  const { onOkClick, removeActionButtons } = props;
  const { size, resetTime, time } = useContext(TimePickerContext);

  const okClickHandler = useCallback(() => onOkClick?.(time), [onOkClick, time]);

  return (
    <>
      <TimePickerContent />
      {!removeActionButtons && <PickerActions size={size} onOkClick={okClickHandler} onClearClick={resetTime} spread />}
    </>
  );
};

export default TimePickerContainer;
