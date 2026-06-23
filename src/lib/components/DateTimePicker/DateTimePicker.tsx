import { DateTimePickerProps } from "./types";
import Picker from "@/components/Motif/Pickers/Picker";
import { DateTimePickerProvider } from "./context/DateTimePickerProvider";
import DateTimePickerContainer from "./components/DateTimePickerContainer";
import { PropsWithRef } from "../../types";
import { useDateLocale } from "src/i18n/useDateLocale.ts";

const DateTimePicker = (props: PropsWithRef<DateTimePickerProps, HTMLDivElement>) => {
  const {
    size = "md",
    variant = "borderless",
    timeFormat = "24h",
    locale,
    fluid,
    value,
    onDateChange,
    onTimeChange,
    onOkClick,
    secondsEnabled,
    onClearClick,
    removeActionButtons,
    firstDayOfWeek = 1,
    style,
    className,
    ref,
  } = props;

  const resolvedLocale = useDateLocale(locale);
  return (
    <Picker size={size} variant={variant} fluid={fluid} ref={ref} style={style} className={`mtf-DateTimePicker ${className ?? ""}`.trim()}>
      <DateTimePickerProvider
        firstDayOfWeek={firstDayOfWeek}
        size={size}
        value={value}
        onTimeChange={onTimeChange}
        onDateChange={onDateChange}
        locale={resolvedLocale}
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
