import { DateTimePickerProps } from "./types";
import { LOCALE_DATE_TIME_TR_TR } from "./locale/tr_TR";
import Picker from "@/components/Motif/Pickers/Picker";
import { DateTimePickerProvider } from "./context/DateTimePickerProvider";
import DateTimePickerContainer from "./components/DateTimePickerContainer";
import { PropsWithRef } from "../../types";

const DateTimePicker = (props: PropsWithRef<DateTimePickerProps, HTMLDivElement>) => {
  const {
    size = "md",
    variant = "borderless",
    timeFormat = "24h",
    locale = LOCALE_DATE_TIME_TR_TR,
    fluid,
    value,
    onDateChange,
    onTimeChange,
    onOkClick,
    secondsEnabled,
    onClearClick,
    removeActionButtons,
    style,
    className,
    ref,
  } = props;

  return (
    <Picker size={size} variant={variant} fluid={fluid} ref={ref} style={style} className={`mtf-DateTimePicker ${className ?? ""}`.trim()}>
      <DateTimePickerProvider
        size={size}
        value={value}
        onTimeChange={onTimeChange}
        onDateChange={onDateChange}
        locale={locale}
        secondsEnabled={secondsEnabled}
        timeFormat={timeFormat}
        fluid={fluid}
        onClearClick={onClearClick}
      >
        <DateTimePickerContainer onOkClick={onOkClick} removeActionButtons={removeActionButtons} />
      </DateTimePickerProvider>
    </Picker>
  );
};
DateTimePicker.displayName = "DateTimePicker";
export default DateTimePicker;
