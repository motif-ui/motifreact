"use client";

import GlobalIconWrapper from "@/components/Motif/GlobalIconWrapper/GlobalIconWrapper";
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
    loader,
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
      {iconLeft && <GlobalIconWrapper icon={iconLeft} className={styles.icon} />}
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
      {loader ? (
        <svg className={styles.loader} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray="62.8 188.4"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <>
          {iconRight && <GlobalIconWrapper icon={iconRight} className={styles.icon} />}
          {buttonRight && <MotifIconButton name={buttonRight.name} className={styles.icon} size={size} onClick={buttonRight.onClick} />}
          {clearable && <MotifIconButton name="cancel_outline" disabled={disabled || readOnly} size={size} onClick={clearHandler} />}
        </>
      )}
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
