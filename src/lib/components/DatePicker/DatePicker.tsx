import Picker from "../Motif/Pickers/Picker";
import { useContext } from "react";
import { DatePickerProps } from "./types";
import { DatePickerProvider } from "@/components/DatePicker/context/DatePickerProvider";
import DateSelector from "@/components/DatePicker/components/DateSelector/DateSelector";
import { DateTimePickerContext } from "@/components/DateTimePicker/context/DateTimePickerProvider";
import { PropsWithRef } from "../../types";
import DatePickerContainer from "@/components/DatePicker/components/DatePickerContainer";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { useDateLocale } from "src/i18n/useDateLocale.ts";

export const DatePicker = (props: PropsWithRef<DatePickerProps, HTMLDivElement>) => {
  const {
    size = "md",
    variant = "borderless",
    fluid,
    onOkClick,
    value,
    locale: propsLocale,
    onDateChange,
    onPickerChange,
    onClearClick,
    removeActionButtons,
    firstDayOfWeek = 1,
    className,
    style,
    ref,
  } = usePropsWithThemeDefaults("DatePicker", props);
  const externalPickerContext = useContext(DateTimePickerContext);
  const locale = useDateLocale(propsLocale);
  return (
    <DatePickerProvider
      size={size}
      value={value}
      locale={locale}
      firstDayOfWeek={firstDayOfWeek}
      fluid={!!fluid}
      onDateChange={onDateChange}
      onPickerChange={onPickerChange}
      onClearClick={onClearClick}
    >
      {externalPickerContext ? (
        <DateSelector />
      ) : (
        <Picker size={size} variant={variant} fluid={fluid} ref={ref} style={style} className={`mtf-DatePicker ${className ?? ""}`.trim()}>
          <DatePickerContainer onOkClick={onOkClick} removeActionButtons={removeActionButtons} />
        </Picker>
      )}
    </DatePickerProvider>
  );
};
DatePicker.displayName = "DatePicker";
export default DatePicker;
