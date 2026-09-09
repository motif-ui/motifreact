import Picker from "../Motif/Pickers/Picker";
import { DatePickerProps } from "./types";
import { DatePickerProvider } from "@/components/DatePicker/context/DatePickerProvider";
import DatePickerContainer from "@/components/DatePicker/components/DatePickerContainer";
import { PropsWithRef } from "../../types";
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
  const locale = useDateLocale(propsLocale);
  return (
    <Picker size={size} variant={variant} fluid={fluid} ref={ref} style={style} className={`mtf-DatePicker ${className ?? ""}`.trim()}>
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
        <DatePickerContainer onOkClick={onOkClick} removeActionButtons={removeActionButtons} />
      </DatePickerProvider>
    </Picker>
  );
};
DatePicker.displayName = "DatePicker";
export default DatePicker;
