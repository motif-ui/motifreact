"use client";

import Icon from "@/components/Icon";
import styles from "./InputText.module.scss";
import { ChangeEvent, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { PropsWithRef } from "../../../types";
import { sanitizeModuleRootClasses } from "../../../../utils/cssUtils";
import { MotifIconButton } from "@/components/Motif/Icon";
import { InternalInputProps } from "@/components/Motif/InputText/types";

const InputText = (props: PropsWithRef<InternalInputProps, HTMLDivElement>) => {
  const {
    name,
    id,
    size,
    placeholder,
    maxLength,
    type,
    pill,
    uncontrolled,
    clearable,
    value = "",
    iconLeft,
    iconRight,
    buttonRight,
    disabled,
    readOnly,
    disableTyping,
    error,
    success,
    onChange,
    onFocus,
    onKeyUp,
    onClick,
    onClearClick,
    onValueUpdated,
    ref,
    imperativeRef,
    className,
    style,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const prevValueRef = useRef(value);
  useImperativeHandle(imperativeRef, () => ({ valueStateSetter: setItemValue }));

  const [itemValue, setItemValue] = useState(value);
  const controlledProps = uncontrolled ? { defaultValue: value } : { value: itemValue };

  useEffect(() => {
    if (!uncontrolled && value !== prevValueRef.current) {
      prevValueRef.current = value;
      setItemValue(value);
      onValueUpdated?.(value);
    }
  }, [onValueUpdated, uncontrolled, value]);

  const changeProcess = useCallback(
    (val: string, updateInputRefValue?: boolean) => {
      !uncontrolled && setItemValue(val);
      onChange?.(val);
      if (updateInputRefValue && inputRef.current) {
        inputRef.current.value = val;
      }
    },
    [onChange, setItemValue, uncontrolled],
  );

  const changeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      changeProcess(e.target.value);
    },
    [changeProcess],
  );

  const clearHandler = useCallback(() => {
    changeProcess("", true);
    onClearClick?.();
  }, [changeProcess, onClearClick]);

  const adjustNumberValue = useCallback((v: number) => changeProcess(String(Number(inputRef.current?.value) + v), true), [changeProcess]);

  const classNames = sanitizeModuleRootClasses(styles, className, [
    size,
    disabled ? "disabled" : error ? "error" : success && "success",
    readOnly && "readOnly",
    pill && "pill",
  ]);

  return (
    <div className={classNames} ref={ref} data-testid="inputItem" style={style}>
      {iconLeft && (
        <Icon className={styles.icon} size={size}>
          {iconLeft}
        </Icon>
      )}
      <input
        id={id}
        type={type}
        ref={inputRef}
        name={name}
        placeholder={placeholder}
        onChange={changeHandler}
        disabled={disabled}
        readOnly={readOnly || disableTyping}
        maxLength={maxLength}
        onClick={onClick}
        onFocus={onFocus}
        onKeyUp={onKeyUp}
        {...controlledProps}
      />
      {iconRight && (
        <Icon className={styles.icon} size={size}>
          {iconRight}
        </Icon>
      )}
      {buttonRight && <MotifIconButton name={buttonRight.name} className={styles.icon} size={size} onClick={buttonRight.onClick} />}
      {clearable && <MotifIconButton name="cancel_outline" disabled={disabled || readOnly} size={size} onClick={clearHandler} />}
      {type === "number" && (
        <div className={styles.numberButtons}>
          <button type="button" onClick={() => adjustNumberValue(1)} disabled={disabled || readOnly}>
            +
          </button>
          <button type="button" onClick={() => adjustNumberValue(-1)} disabled={disabled || readOnly}>
            -
          </button>
        </div>
      )}
    </div>
  );
};

InputText.displayName = "InternalInputText";
export default InputText;
