"use client";

import styles from "../DateRangePicker.module.scss";
import { useCallback, useContext, useRef } from "react";
import { DateRangePickerContext } from "../context/DateRangePickerProvider";
import PickerActions from "@/components/Motif/Pickers/components/PickerActions";
import CustomDatePicker from "./CustomDatePicker";
import { useMouseOverAndLeave } from "@/components/DateRangePicker/hooks/useMouseOverAndLeave";
import DaysDropdown from "@/components/DateRangePicker/components/DaysDropdown";
import RangeInput from "@/components/DateRangePicker/components/RangeInput";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

type Props = {
  removeActionButtons?: boolean;
  onOkClick?: (range: (Date | undefined)[]) => void;
  onClearClick?: () => void;
};

const DateRangePickerContainer = (props: Props) => {
  const { removeActionButtons, onOkClick, onClearClick } = props;
  const { dateCouple, size, setDateCouple, setMonths, sliding, initialMonths, onDateChange, partialSelection } =
    useContext(DateRangePickerContext);

  const containerRef = useRef<HTMLDivElement>(null);
  const { refPicker1, refPicker2 } = useMouseOverAndLeave(containerRef, partialSelection);

  const okClickHandler = useCallback(() => {
    onOkClick?.(dateCouple);
  }, [dateCouple, onOkClick]);

  const clearClickHandler = useCallback(() => {
    if (dateCouple.some(d => !!d)) {
      setMonths(initialMonths);
      setDateCouple([undefined, undefined]);
      onDateChange?.([undefined, undefined]);
    }
    onClearClick?.();
  }, [dateCouple, initialMonths, onClearClick, onDateChange, setDateCouple, setMonths]);

  const classes = sanitizeModuleClasses(styles, "rangeSelector", size);
  const pickersClasses = sanitizeModuleClasses(styles, "datePickers", sliding);

  return (
    <>
      <div className={classes}>
        <div className={styles.selectionBar}>
          <DaysDropdown />
          <RangeInput index={0} />
          <RangeInput index={1} />
        </div>
        <div className={pickersClasses} ref={containerRef} data-testid="DateRangePickerContainer">
          <CustomDatePicker order={0} />
          <CustomDatePicker order={1} daysRef={refPicker1} />
          <CustomDatePicker order={2} daysRef={refPicker2} />
          <CustomDatePicker order={3} />
        </div>
      </div>
      {!removeActionButtons && <PickerActions size={size} onOkClick={okClickHandler} onClearClick={clearClickHandler} />}
    </>
  );
};

export default DateRangePickerContainer;
