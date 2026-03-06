import Picker from "../Motif/Pickers/Picker";
import { useContext } from "react";
import { DatePickerProps } from "./types";
import { DatePickerProvider } from "@/components/DatePicker/context/DatePickerProvider";
import DateSelector from "@/components/DatePicker/components/DateSelector/DateSelector";
import { LOCALE_DATE_TR_TR } from "./locale/tr_TR";
import { DateTimePickerContext } from "@/components/DateTimePicker/context/DateTimePickerProvider";
import { PropsWithRef } from "../../types";
import DatePickerContainer from "@/components/DatePicker/components/DatePickerContainer";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";

export const DatePicker = (props: PropsWithRef<DatePickerProps, HTMLDivElement>) => {
  const {
    size = "md",
    variant = "borderless",
    fluid,
    onOkClick,
    value,
    locale = LOCALE_DATE_TR_TR,
    onDateChange,
    onPickerChange,
    onClearClick,
    removeActionButtons,
    className,
    style,
    ref,
  } = usePropsWithThemeDefaults("DatePicker", props);
  const externalPickerContext = useContext(DateTimePickerContext);

  return (
    <DatePickerProvider
      size={size}
      value={value}
      locale={locale}
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
