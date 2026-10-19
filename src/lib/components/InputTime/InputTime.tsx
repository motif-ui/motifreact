"use client";

import styles from "./InputTime.module.scss";
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import useAnchoredOverlay from "../../hooks/useAnchoredOverlay";
import TimePicker from "@/components/TimePicker";
import { Time } from "../TimePicker/types";
import { formatTime, parseTime, validateTime } from "@/components/InputTime/helper";
import { PropsWithRef } from "../../types";
import { InputTimeProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { InputValue } from "@/components/Form/types";
import { sanitizeModuleRootClasses } from "src/utils/cssUtils.ts";
import { isNullOrEmptyString } from "../../../utils/utils";
import InputText from "@/components/Motif/InputText/InputText";
import MotifIcon from "@/components/Motif/Icon/MotifIcon";
import { useDateLocale } from "src/i18n/useDateLocale.ts";

const pickerSizeMap = {
  xs: "xs",
  sm: "xs",
  md: "sm",
  lg: "md",
} as const;

const InputTime = (p: PropsWithRef<InputTimeProps, HTMLDivElement>) => {
  const props = usePropsWithThemeDefaults("InputTime", p);
  const {
    editable,
    pill,
    value,
    onChange,
    secondsEnabled,
    format = "24h",
    locale: propsLocale,
    placeholder = `__:__${secondsEnabled ? ":__" : ""}`,
    ref,
    style,
    className,
    icon,
  } = props;

  const locale = useDateLocale(propsLocale);
  const [itemValue, setItemValue] = useState<Time | undefined>(validateTime(value as Time, !!secondsEnabled));
  const [typedValue, setTypedValue] = useState<string>(formatTime(itemValue, false, !!secondsEnabled, format, locale));

  const valueStateSetter = useCallback(
    (time?: Time) => {
      setItemValue(time);
      setTypedValue(formatTime(time, false, !!secondsEnabled, format, locale));
    },
    [format, locale, secondsEnabled],
  );

  const { size, error, readOnly, success, disabled, onFormFieldValueUpdate, name } = useRegisterFormField({
    props,
    defaultValue: undefined,
    valueStateSetter,
  });

  const innerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => innerRef.current!, []);

  const pickerCloseHandler = useCallback(() => {
    const validatedTime = parseTime(typedValue, !!secondsEnabled);
    if (!validatedTime) {
      setTypedValue(formatTime(itemValue, false, !!secondsEnabled, format, locale));
    }
  }, [format, itemValue, locale, secondsEnabled, typedValue]);

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

  const okClickHandler = useCallback(() => {
    pickerCloseHandler();
    hide();
  }, [hide, pickerCloseHandler]);

  useEffect(() => {
    const validatedTime = validateTime(value as Time, !!secondsEnabled);
    setItemValue(validatedTime);
    setTypedValue(formatTime(validatedTime, false, !!secondsEnabled, format, locale));
    onFormFieldValueUpdate?.(validatedTime);
  }, [format, locale, onFormFieldValueUpdate, secondsEnabled, value]);

  const applyChanges = useCallback(
    (time?: Time) => {
      if (time != itemValue) {
        setItemValue(time);
        onFormFieldValueUpdate?.(time);
        onChange?.(time);
      }
    },
    [itemValue, onChange, onFormFieldValueUpdate],
  );

  const onTextFieldChange = useCallback(
    (e: InputValue) => {
      const typedValue = e as string;
      setTypedValue(typedValue);

      const validatedTime = parseTime(typedValue, !!secondsEnabled);
      validatedTime && applyChanges(validatedTime);
    },
    [applyChanges, secondsEnabled],
  );

  const timeChangeHandler = useCallback(
    (time?: Time) => {
      const formattedTime = formatTime(time, true, !!secondsEnabled, format, locale);
      setTypedValue(formattedTime);

      const validatedTime = parseTime(formattedTime, !!secondsEnabled);
      if (validatedTime) {
        applyChanges(time);
      }
    },
    [applyChanges, format, locale, secondsEnabled],
  );

  const clearClickHandler = useCallback(
    (dismissPicker?: boolean) => {
      applyChanges(undefined);
      setTypedValue("");
      dismissPicker && hide();
    },
    [applyChanges, hide],
  );

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
        name={name}
        iconLeft={isNullOrEmptyString(icon) ? undefined : (icon ?? <MotifIcon name="schedule" size={size} />)}
        clearable
        onClearClick={() => clearClickHandler(true)}
        size={size}
        pill={pill}
        placeholder={placeholder}
        success={success}
        onChange={onTextFieldChange}
        error={error}
        disabled={disabled}
        readOnly={readOnly}
        disableTyping={!editable}
        value={typedValue}
        onClick={pickerShowHandler}
        onFocus={pickerShowHandler}
      />

      {attached &&
        createPortal(
          <TimePicker
            ref={pickerRef}
            variant="bordered"
            secondsEnabled={secondsEnabled}
            format={format}
            locale={locale}
            size={pickerSizeMap[size]}
            value={itemValue}
            onTimeChange={timeChangeHandler}
            className={styles.timePicker}
            style={pickerStyle}
            onOkClick={okClickHandler}
            onClearClick={() => clearClickHandler()}
          />,
          document.body,
        )}
    </>
  );
};

InputTime.displayName = "InputTime";
export default InputTime;
