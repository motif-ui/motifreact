"use client";

import styles from "./InputTime.module.scss";
import { useCallback, useEffect, useImperativeHandle, useState } from "react";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import useOutsideClick from "../../hooks/useOutsideClick";
import TimePicker from "@/components/TimePicker";
import { Time } from "../TimePicker/types";
import { formatTime, parseTime, validateTime } from "@/components/InputTime/helper";
import { PropsWithRef } from "../../types";
import { LOCALE_TIME_PICKER_TR_TR } from "@/components/TimePicker/locale/tr_TR";
import { InputTimeProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { InputValue } from "@/components/Form/types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import InputText from "@/components/InputText";
import MotifIcon from "@/components/Motif/Icon/MotifIcon";
import MotifIconButton from "@/components/Motif/Icon/MotifIconButton";

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
    locale = LOCALE_TIME_PICKER_TR_TR,
    placeholder = `__:__${secondsEnabled ? ":__" : ""}`,
    ref,
    style,
    className,
  } = props;

  const [pickerVisible, setPickerVisible] = useState(false);
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

  const onClickedOutside = useCallback(() => {
    const validatedTime = parseTime(typedValue, !!secondsEnabled);
    if (!validatedTime) {
      setTypedValue(formatTime(itemValue, false, !!secondsEnabled, format, locale));
    }
    setPickerVisible(false);
  }, [format, itemValue, locale, secondsEnabled, typedValue]);

  const innerRef = useOutsideClick<HTMLDivElement>(onClickedOutside);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useImperativeHandle(ref, () => innerRef.current!, []);

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
      setPickerVisible(!dismissPicker);
    },
    [applyChanges],
  );

  const pickerShowHandler = useCallback(() => {
    !readOnly && !disabled && setPickerVisible(true);
  }, [disabled, readOnly]);

  const classNames = sanitizeModuleRootClasses(styles, className);

  return (
    <div ref={innerRef} className={classNames} style={style}>
      <InputText
        iconLeft={<MotifIcon name="schedule" size={size} />}
        iconRight={
          itemValue &&
          !disabled &&
          !readOnly && <MotifIconButton name="cancel_outline" size={size} onClick={() => clearClickHandler(true)} />
        }
        name={name}
        size={size}
        pill={pill}
        placeholder={placeholder}
        success={success}
        onChange={onTextFieldChange}
        error={error}
        disabled={disabled}
        readOnlyWithEnabledLook={!editable}
        value={typedValue}
        onClick={pickerShowHandler}
        onFocus={pickerShowHandler}
      />

      {pickerVisible && (
        <TimePicker
          variant="bordered"
          secondsEnabled={secondsEnabled}
          format={format}
          locale={locale}
          size={pickerSizeMap[size]}
          value={itemValue}
          onTimeChange={timeChangeHandler}
          className={styles.timePicker}
          onOkClick={onClickedOutside}
          onClearClick={() => clearClickHandler()}
        />
      )}
    </div>
  );
};

InputTime.displayName = "InputTime";
export default InputTime;
