import { PropsWithRef } from "../../types";
import Picker from "@/components/Motif/Pickers/Picker";
import { DateRangePickerProvider } from "@/components/DateRangePicker/context/DateRangePickerProvider";
import { DateRangePickerProps } from "./types";
import DateRangePickerContainer from "@/components/DateRangePicker/components/DateRangePickerContainer";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { useDateLocale } from "src/i18n/useDateLocale.ts";

const DateRangePicker = (props: PropsWithRef<DateRangePickerProps, HTMLDivElement>) => {
  const {
    value,
    size = "md",
    variant = "borderless",
    locale,
    ref,
    onDateChange,
    onOkClick,
    onClearClick,
    removeActionButtons,
    className,
    style,
  } = usePropsWithThemeDefaults("DateRangePicker", props);

  const resolvedLocale = useDateLocale(locale);
  return (
    <Picker size={size} variant={variant} wide ref={ref} style={style} className={`mtf-DateRangePicker ${className ?? ""}`.trim()}>
      <DateRangePickerProvider value={value} size={size} locale={resolvedLocale} onDateChange={onDateChange}>
        <DateRangePickerContainer removeActionButtons={removeActionButtons} onOkClick={onOkClick} onClearClick={onClearClick} />
      </DateRangePickerProvider>
    </Picker>
  );
};

DateRangePicker.displayName = "DateRangePicker";
export default DateRangePicker;
