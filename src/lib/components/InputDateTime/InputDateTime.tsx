"use client";

import styles from "./InputDateTime.module.scss";
import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import useAnchoredOverlay from "../../hooks/useAnchoredOverlay";
import { formatDateTime, parseDateTime } from "./helper";
import DateTimePicker from "@/components/DateTimePicker";
import { defaultDateFormat } from "../Motif/Pickers/types";
import { Time } from "@/components/TimePicker/types";
import { PropsWithRef } from "../../types";
import { InputDateTimeProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { InputValue } from "../Form/types";
import { sanitizeModuleRootClasses } from "src/utils/cssUtils.ts";
import InputText from "@/components/Motif/InputText/InputText";
import { MotifIcon } from "../Motif/Icon";
import { DateUtils } from "src/utils/dateUtils.ts";
import { useDateLocale } from "src/i18n/useDateLocale.ts";

const pickerSizeMap = {
  xs: "xs",
  sm: "xs",
  md: "sm",
  lg: "md",
} as const;

const InputDateTime = (p: PropsWithRef<InputDateTimeProps, HTMLDivElement>) => {
  const props = usePropsWithThemeDefaults("InputDateTime", p);
  const {
    editable,
    pill,
    value,
    onChange,
    secondsEnabled,
    timeFormat = "24h",
    locale: propsLocale,
    ref,
    style,
    className,
    firstDayOfWeek,
  } = props;

  const locale = useDateLocale(propsLocale);
  const format = useMemo(() => ({ ...defaultDateFormat, ...props.dateFormat }), [props.dateFormat]);
  const placeholder = useMemo(
    () =>
      props.placeholder
        ? props.placeholder
        : `${format.order.map(o => format[`${o}Format`]).join(format.delimiter)} __:__${secondsEnabled ? ":__" : ""}`,
    [format, props.placeholder, secondsEnabled],
  );

  const [itemValue, setItemValue] = useState<Date | undefined>(value as Date);
  const [typedValue, setTypedValue] = useState<string>(formatDateTime(itemValue, format, !!secondsEnabled, timeFormat, locale));

  const valueStateSetter = useCallback(
    (date?: Date) => {
      setItemValue(date);
      setTypedValue(formatDateTime(date, format, !!secondsEnabled, timeFormat, locale));
    },
    [format, secondsEnabled, timeFormat, locale],
  );

  const { size, error, readOnly, success, disabled, onFormFieldValueUpdate, name } = useRegisterFormField({
    props,
    defaultValue: undefined,
    valueStateSetter,
  });

  const applyChanges = useCallback(
    (dateTime?: Date) => {
      if (dateTime?.getTime() != itemValue?.getTime()) {
        setItemValue(dateTime);
        onFormFieldValueUpdate?.(dateTime);
        onChange?.(dateTime);
      }
    },
    [itemValue, onChange, onFormFieldValueUpdate],
  );

  useEffect(() => {
    setTypedValue(formatDateTime(value, format, !!secondsEnabled, timeFormat, locale));
    setItemValue(value);
  }, [format, secondsEnabled, value, timeFormat, locale]);

  const innerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => innerRef.current!, []);

  const pickerCloseHandler = useCallback(() => {
    const parsedDate = parseDateTime(typedValue, format, !!secondsEnabled, locale);
    !parsedDate && setTypedValue(formatDateTime(itemValue, format, !!secondsEnabled, timeFormat, locale));
  }, [format, itemValue, secondsEnabled, typedValue, timeFormat, locale]);

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

  const onDateChange = useCallback(
    (date?: Date) => {
      setTypedValue(formatDateTime(date, format, !!secondsEnabled, timeFormat, locale));
      applyChanges(date);
    },
    [applyChanges, format, secondsEnabled, timeFormat, locale],
  );

  const onTimeChange = useCallback(
    (time?: Time) => {
      const newDate = DateUtils.getDateWithTime(itemValue ?? new Date(), time);
      setTypedValue(formatDateTime(newDate, format, !!secondsEnabled, timeFormat, locale));
      applyChanges(newDate);
    },
    [applyChanges, format, itemValue, secondsEnabled, timeFormat, locale],
  );

  const clearClickHandler = useCallback(() => {
    applyChanges(undefined);
    setTypedValue("");
    hide();
  }, [applyChanges, hide]);

  const pickerShowHandler = useCallback(() => {
    !readOnly && !disabled && show();
  }, [disabled, readOnly, show]);

  const onInputTimeChange = useCallback(
    (e: InputValue) => {
      const typedValue = e as string;
      setTypedValue(typedValue);

      const parsedDate = parseDateTime(typedValue, format, !!secondsEnabled, locale);
      parsedDate && applyChanges(parsedDate);
    },
    [applyChanges, format, secondsEnabled, locale],
  );
  const classNames = sanitizeModuleRootClasses(styles, className);

  return (
    <>
      <InputText
        ref={innerRef}
        className={classNames}
        style={style}
        iconLeft={<MotifIcon name="event" size={size} />}
        name={name}
        onClearClick={clearClickHandler}
        clearable
        size={size}
        pill={pill}
        placeholder={placeholder}
        success={success}
        error={error}
        disabled={disabled}
        readOnly={readOnly}
        disableTyping={!editable}
        value={typedValue}
        onChange={onInputTimeChange}
        onClick={pickerShowHandler}
        onFocus={pickerShowHandler}
      />
      {attached &&
        createPortal(
          <DateTimePicker
            ref={pickerRef}
            firstDayOfWeek={firstDayOfWeek}
            variant="bordered"
            secondsEnabled={secondsEnabled}
            timeFormat={timeFormat}
            locale={locale}
            size={pickerSizeMap[size]}
            value={itemValue}
            removeActionButtons
            onDateChange={onDateChange}
            onTimeChange={onTimeChange}
            onOkClick={() => hide()}
            className={styles.dateTimePicker}
            style={pickerStyle}
          />,
          document.body,
        )}
    </>
  );
};

InputDateTime.displayName = "InputDateTime";
export default InputDateTime;
