"use client";

import styles from "./InputDate.module.scss";
import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { defaultDateFormat } from "../Motif/Pickers/types";
import { InputDateProps } from "./types";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import DatePicker from "@/components/DatePicker";
import useAnchoredOverlay from "../../hooks/useAnchoredOverlay";
import { formatDate, parseDate } from "@/components/InputDate/helper";
import { PropsWithRef } from "../../types";
import { InputValue } from "../Form/types";
import { sanitizeModuleRootClasses } from "src/utils/cssUtils.ts";
import { isNullOrEmptyString } from "../../../utils/utils";
import InputText from "@/components/Motif/InputText/InputText";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { useDateLocale } from "src/i18n/useDateLocale.ts";
import { MotifIcon } from "../Motif/Icon";

const pickerSizeMap = {
  xs: "xs",
  sm: "xs",
  md: "sm",
  lg: "md",
} as const;

const InputDate = (p: PropsWithRef<InputDateProps, HTMLDivElement>) => {
  const props = usePropsWithThemeDefaults("InputDate", p);
  const { editable, pill, value, onChange, ref, style, className, locale: propsLocale, firstDayOfWeek, icon } = props;
  const format = useMemo(() => ({ ...defaultDateFormat, ...props.format }), [props.format]);
  const locale = useDateLocale(propsLocale);

  const placeholder = useMemo(
    () => props.placeholder ?? format.order.map(o => format[`${o}Format`]).join(format.delimiter),
    [format, props.placeholder],
  );

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

  const innerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => innerRef.current!, []);

  const pickerCloseHandler = useCallback(() => !isValueValid && setTypedValue(""), [isValueValid]);

  const {
    attached,
    style: pickerStyle,
    overlayRef: pickerRef,
    show,
    hide,
  } = useAnchoredOverlay({
    anchorRef: innerRef,
    placement: "bottomLeft",
    onClose: pickerCloseHandler,
    closeOnOutsideClick: true,
    tabBridge: true,
  });

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
      hide();
    },
    [applyChanges, format, hide, locale],
  );

  const clearClickHandler = useCallback(() => hide(), [hide]);

  const pickerShowHandler = useCallback(() => {
    !readOnly && !disabled && show();
  }, [disabled, readOnly, show]);

  const classNames = sanitizeModuleRootClasses(styles, className);

  return (
    <>
      <InputText
        ref={innerRef}
        className={classNames}
        style={style}
        iconLeft={isNullOrEmptyString(icon) ? undefined : (icon ?? <MotifIcon name="calendar_month" size={size} />)}
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
      {attached &&
        createPortal(
          <DatePicker
            ref={pickerRef}
            firstDayOfWeek={firstDayOfWeek}
            removeActionButtons
            variant="bordered"
            size={pickerSizeMap[size]}
            value={itemValue}
            onDateChange={dateChangeHandler}
            className={styles.datePicker}
            style={pickerStyle}
            locale={locale}
          />,
          document.body,
        )}
    </>
  );
};

InputDate.displayName = "InputDate";
export default InputDate;
