import { useContext } from "react";
import { TimePickerProvider } from "./context/TimePickerProvider";
import { TimePickerProps } from "./types";
import { DateTimePickerContext } from "@/components/DateTimePicker/context/DateTimePickerProvider";
import { PropsWithRef } from "../../types";
import TimePickerContainer from "@/components/TimePicker/components/TimePickerContainer";
import Picker from "@/components/Motif/Pickers/Picker";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { useDateLocale } from "src/i18n/useDateLocale.ts";

const TimePicker = (props: PropsWithRef<TimePickerProps, HTMLDivElement>) => {
  const {
    size = "md",
    variant = "borderless",
    fluid,
    onOkClick,
    onPeriodChange,
    locale: propsLocale,
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

  const locale = useDateLocale(propsLocale);
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
