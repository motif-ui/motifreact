import Picker from "../Motif/Pickers/Picker";
import { DatePickerProps } from "./types";
import DateSelector from "@/components/DatePicker/components/DateSelector/DateSelector";
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
      <DateSelector
        size={size}
        value={value}
        locale={locale}
        firstDayOfWeek={firstDayOfWeek}
        fluid={!!fluid}
        onDateChange={onDateChange}
        onPickerChange={onPickerChange}
        onClearClick={onClearClick}
        onOkClick={onOkClick}
        removeActionButtons={removeActionButtons}
      />
    </Picker>
  );
};
DatePicker.displayName = "DatePicker";
export default DatePicker;
