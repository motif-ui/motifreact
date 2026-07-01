"use client";

import styles from "./InputDate.module.scss";
import { useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { defaultDateFormat } from "../Motif/Pickers/types";
import { InputDateProps } from "./types";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import DatePicker from "@/components/DatePicker";
import useOutsideClick from "../../hooks/useOutsideClick";
import { formatDate, parseDate } from "@/components/InputDate/helper";
import { PropsWithRef } from "../../types";
import { InputValue } from "../Form/types";
import { sanitizeModuleRootClasses } from "src/utils/cssUtils.ts";
import InputText from "@/components/Motif/InputText/InputText";
import { MotifIcon } from "../Motif/Icon";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { useDateLocale } from "src/i18n/useDateLocale.ts";

const pickerSizeMap = {
  xs: "xs",
  sm: "xs",
  md: "sm",
  lg: "md",
} as const;

const InputDate = (p: PropsWithRef<InputDateProps, HTMLDivElement>) => {
  const props = usePropsWithThemeDefaults("InputDate", p);
  const { editable, pill, value, onChange, ref, style, className, locale: propsLocale, firstDayOfWeek } = props;
  const format = useMemo(() => ({ ...defaultDateFormat, ...props.format }), [props.format]);
  const locale = useDateLocale(propsLocale);

  const placeholder = useMemo(
    () => props.placeholder ?? format.order.map(o => format[`${o}Format`]).join(format.delimiter),
    [format, props.placeholder],
  );

  const [pickerVisible, setPickerVisible] = useState(false);
  const [itemValue, setItemValue] = useState<Date | undefined>(value as Date);
  const [typedValue, setTypedValue] = useState<string>(formatDate(itemValue, format, locale));
  const [isValueValid, setIsValueValid] = useState(!!value);

  const valueStateSetter = useCallback(
    (date?: Date) => {
      setItemValue(date);
      setTypedValue(formatDate(date, format, locale));
    },
    [format, locale],
  );

  const { size, error, readOnly, success, disabled, onFormFieldValueUpdate, name } = useRegisterFormField({
    props,
    defaultValue: undefined,
    valueStateSetter,
  });

  const outsideClickHandler = useCallback(() => {
    setPickerVisible(false);
    !isValueValid && setTypedValue("");
  }, [isValueValid]);

  const innerRef = useOutsideClick<HTMLDivElement>(outsideClickHandler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useImperativeHandle(ref, () => innerRef.current!, []);

  useEffect(() => {
    setItemValue(value as Date);
    setTypedValue(formatDate(value as Date, format, locale));
    setIsValueValid(!!value);
    onFormFieldValueUpdate?.(value);
  }, [format, locale, onFormFieldValueUpdate, value]);

  const applyChanges = useCallback(
    (date?: Date, preventOnChangeTrigger?: boolean) => {
      setItemValue(date);
      onFormFieldValueUpdate?.(date);
      !preventOnChangeTrigger && onChange?.(date);
    },
    [onChange, onFormFieldValueUpdate],
  );

  const onInputChange = useCallback(
    (value?: InputValue) => {
      const typedValue = value as string;
      setTypedValue(typedValue);

      // if there is a change in validation status
      const validatedDate = parseDate(typedValue, format, locale);
      if (isValueValid !== !!validatedDate || (!!validatedDate && itemValue?.getTime() !== validatedDate.getTime())) {
        console.log("!!validatedDate", !!validatedDate);
        setIsValueValid(!!validatedDate);
        applyChanges(validatedDate);
      }
    },
    [applyChanges, format, isValueValid, itemValue, locale],
  );

  const dateChangeHandler = useCallback(
    (date?: Date) => {
      applyChanges(date);
      setTypedValue(formatDate(date, format, locale));
      setIsValueValid(true);
      setPickerVisible(false);
    },
    [applyChanges, format, locale],
  );

  const clearClickHandler = useCallback(() => {
    setPickerVisible(false);
  }, []);

  const pickerShowHandler = useCallback(() => {
    !readOnly && !disabled && setPickerVisible(true);
  }, [disabled, readOnly]);

  const classNames = sanitizeModuleRootClasses(styles, className);

  return (
    <div ref={innerRef} className={classNames} style={style} data-testid="inputDate">
      <InputText
        iconLeft={<MotifIcon name="calendar_month" size={size} />}
        clearable
        name={name}
        size={size}
        pill={pill}
        placeholder={placeholder}
        success={success}
        error={error}
        disabled={disabled}
        readOnly={readOnly}
        disableTyping={!editable}
        value={typedValue}
        onChange={onInputChange}
        onClick={pickerShowHandler}
        onFocus={pickerShowHandler}
        onClearClick={clearClickHandler}
      />
      {pickerVisible && (
        <DatePicker
          firstDayOfWeek={firstDayOfWeek}
          removeActionButtons
          variant="bordered"
          size={pickerSizeMap[size]}
          value={itemValue}
          onDateChange={dateChangeHandler}
          className={styles.datePicker}
          locale={locale}
        />
      )}
    </div>
  );
};

InputDate.displayName = "InputDate";
export default InputDate;
