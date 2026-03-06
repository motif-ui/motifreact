import { PropsWithRef } from "../../types";
import Picker from "@/components/Motif/Pickers/Picker";
import { DateRangePickerProvider } from "@/components/DateRangePicker/context/DateRangePickerProvider";
import { DateRangePickerProps } from "./types";
import DateRangePickerContainer from "@/components/DateRangePicker/components/DateRangePickerContainer";
import { LOCALE_DATE_RANGE_TR_TR } from "@/components/DateRangePicker/locale/tr_TR";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";

const DateRangePicker = (props: PropsWithRef<DateRangePickerProps, HTMLDivElement>) => {
  const {
    value,
    size = "md",
    variant = "borderless",
    locale = LOCALE_DATE_RANGE_TR_TR,
    ref,
    onDateChange,
    onOkClick,
    onClearClick,
    removeActionButtons,
    className,
    style,
  } = usePropsWithThemeDefaults("DateRangePicker", props);

  return (
    <Picker size={size} variant={variant} wide ref={ref} style={style} className={`mtf-DateRangePicker ${className ?? ""}`.trim()}>
      <DateRangePickerProvider value={value} size={size} locale={locale} onDateChange={onDateChange}>
        <DateRangePickerContainer removeActionButtons={removeActionButtons} onOkClick={onOkClick} onClearClick={onClearClick} />
      </DateRangePickerProvider>
    </Picker>
  );
};

DateRangePicker.displayName = "DateRangePicker";
export default DateRangePicker;
