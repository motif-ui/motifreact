"use client";

import { useCallback, useContext, useState } from "react";
import { DateTimePickerContext } from "@/components/DateTimePicker/context/DateTimePickerProvider";
import DateTimeInfo from "@/components/DateTimePicker/components/DateTimeInfo";
import DatePicker from "../../DatePicker";
import TimePicker from "@/components/TimePicker";
import { DatePickerPickerType } from "@/components/DatePicker/types";
import PickerActions from "@/components/Motif/Pickers/components/PickerActions";
import styles from "../DateTimePicker.module.scss";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";
import DateTimeTab from "@/components/DateTimePicker/components/DateTimeTab";

type Props = {
  onOkClick?: (dateTime?: Date) => void;
  removeActionButtons?: boolean;
};

const DateTimePickerContainer = (props: Props) => {
  const { onOkClick, removeActionButtons } = props;
  const {
    activeTab,
    dateChangeHandler,
    timeChangeHandler,
    selectedValue,
    secondsEnabled,
    timeFormat,
    fluid,
    locale,
    size,
    currentTime,
    clearDateTimePicker,
    setSelectedTimePeriod,
  } = useContext(DateTimePickerContext)!;
  const [activeDatePickerSubPicker, setActiveDatePickerSubPicker] = useState<DatePickerPickerType>("day");

  const okClickHandler = useCallback(() => onOkClick?.(selectedValue), [onOkClick, selectedValue]);
  const classes = sanitizeModuleClasses(styles, "dateTimePickerContainer", size);

  return (
    <div className={classes}>
      {activeDatePickerSubPicker === "day" && (
        <>
          <DateTimeInfo />
          <div className={styles.tabItemContainer}>
            <DateTimeTab tabType="date" icon="calendar_month" />
            <DateTimeTab tabType="time" icon="schedule" />
          </div>
        </>
      )}
      {activeTab === "date" ? (
        <DatePicker
          onDateChange={dateChangeHandler}
          value={selectedValue}
          onPickerChange={setActiveDatePickerSubPicker}
          fluid={fluid}
          locale={locale}
          size={size}
        />
      ) : (
        <TimePicker
          className={styles.timePicker}
          onTimeChange={timeChangeHandler}
          value={currentTime}
          secondsEnabled={secondsEnabled}
          format={timeFormat}
          size={size}
          locale={locale}
          onPeriodChange={setSelectedTimePeriod}
        />
      )}
      {!removeActionButtons && activeDatePickerSubPicker === "day" && (
        <PickerActions size={size} onOkClick={okClickHandler} onClearClick={clearDateTimePicker} />
      )}
    </div>
  );
};

export default DateTimePickerContainer;
