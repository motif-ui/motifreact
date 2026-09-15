import { TimePickerProps } from "./types";
import { PropsWithRef } from "../../types";
import { TimePickerProvider } from "@/components/TimePicker/context/TimePickerProvider";
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
    removeActionButtons,
    className,
    style,
    ref,
  } = usePropsWithThemeDefaults("TimePicker", props);

  const locale = useDateLocale(propsLocale);
  return (
    <Picker size={size} variant={variant} fluid={fluid} ref={ref} className={`mtf-TimePicker ${className ?? ""}`.trim()} style={style}>
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
        <TimePickerContainer onOkClick={onOkClick} removeActionButtons={removeActionButtons} />
      </TimePickerProvider>
    </Picker>
  );
};

TimePicker.displayName = "TimePicker";
export default TimePicker;
