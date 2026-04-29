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
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import InputText from "@/components/Motif/InputText/InputText";
import { MotifIcon, MotifIconButton } from "../Motif/Icon";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { LOCALE_DATE_TR_TR } from "@/components/DatePicker/locale/tr_TR";

const pickerSizeMap = {
  xs: "xs",
  sm: "xs",
  md: "sm",
  lg: "md",
} as const;

const InputDate = (p: PropsWithRef<InputDateProps, HTMLDivElement>) => {
  const props = usePropsWithThemeDefaults("InputDate", p);
  const { editable, pill, value, onChange, ref, style, className, locale = LOCALE_DATE_TR_TR } = props;
  const format = useMemo(() => ({ ...defaultDateFormat, ...props.format }), [props.format]);

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
    (date?: Date) => {
      setItemValue(date);
      onFormFieldValueUpdate?.(date);
      onChange?.(date);
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
    if (isValueValid) {
      applyChanges(undefined);
    }
    setTypedValue("");
    setIsValueValid(false);
    setPickerVisible(false);
  }, [applyChanges, isValueValid]);

  const pickerShowHandler = useCallback(() => {
    !readOnly && !disabled && setPickerVisible(true);
  }, [disabled, readOnly]);

  const classNames = sanitizeModuleRootClasses(styles, className);

  return (
    <div ref={innerRef} className={classNames} style={style} data-testid="inputDate">
      <InputText
        iconLeft={<MotifIcon name="calendar_month" size={size} />}
        iconRight={
          typedValue && !disabled && !readOnly ? (
            <MotifIconButton name="cancel_outline" size={size} onClick={clearClickHandler} />
          ) : undefined
        }
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
      />
      {pickerVisible && (
        <DatePicker
          removeActionButtons
          variant="bordered"
          size={pickerSizeMap[size]}
          value={itemValue}
          onDateChange={dateChangeHandler}
          className={styles.datePicker}
        />
      )}
    </div>
  );
};

InputDate.displayName = "InputDate";
export default InputDate;
