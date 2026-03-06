import { useContext } from "react";
import { TimePickerProvider } from "./context/TimePickerProvider";
import { TimePickerProps } from "./types";
import { DateTimePickerContext } from "@/components/DateTimePicker/context/DateTimePickerProvider";
import { PropsWithRef } from "../../types";
import TimePickerContainer from "@/components/TimePicker/components/TimePickerContainer";
import { LOCALE_TIME_PICKER_TR_TR } from "./locale/tr_TR";
import Picker from "@/components/Motif/Pickers/Picker";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";

const TimePicker = (props: PropsWithRef<TimePickerProps, HTMLDivElement>) => {
  const {
    size = "md",
    variant = "borderless",
    fluid,
    onOkClick,
    onPeriodChange,
    locale = LOCALE_TIME_PICKER_TR_TR,
    secondsEnabled,
    onTimeChange,
    value,
    format = "24h",
    onClearClick,
    className,
    style,
    ref,
  } = usePropsWithThemeDefaults("TimePicker", props);
  const externalPickerContext = useContext(DateTimePickerContext);

  return (
    <TimePickerProvider
      size={size}
      secondsEnabled={!!secondsEnabled}
      locale={locale}
      onTimeChange={onTimeChange}
      onPeriodChange={onPeriodChange}
      value={value}
      format={format}
      onClearClick={onClearClick}
    >
      {externalPickerContext ? (
        <TimePickerContainer removeLabel removeActionButtons {...(className && { className })} />
      ) : (
        <Picker size={size} variant={variant} fluid={fluid} ref={ref} className={`mtf-TimePicker ${className ?? ""}`.trim()} style={style}>
          <TimePickerContainer onOkClick={onOkClick} />
        </Picker>
      )}
    </TimePickerProvider>
  );
};

TimePicker.displayName = "TimePicker";
export default TimePicker;
