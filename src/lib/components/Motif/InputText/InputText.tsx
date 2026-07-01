"use client";

import GlobalIconWrapper from "@/components/Motif/GlobalIconWrapper/GlobalIconWrapper";
import styles from "./InputText.module.scss";
import { ChangeEvent, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { PropsWithRef } from "../../../types";
import { sanitizeModuleRootClasses } from "../../../../utils/cssUtils";
import { MotifIconButton } from "@/components/Motif/Icon";
import { InternalInputProps } from "@/components/Motif/InputText/types";
import NumberSpinner from "@/components/Motif/InputText/components/NumberSpinner.tsx";

const InputText = (props: PropsWithRef<InternalInputProps, HTMLDivElement>) => {
  const {
    name,
    id,
    size,
    placeholder,
    maxLength,
    type,
    inputMode,
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
    numberSpinner,
    loader,
    error,
    success,
    onChange,
    onFocus,
    onKeyUp,
    onClick,
    onBlur,
    onClearClick,
    onValueUpdated,
    valueTransformer,
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
      if (valueTransformer) {
        const processed = valueTransformer(val);
        if (processed === undefined) {
          // Transformer rejected the value — restore the DOM to the current valid state and don't trigger anything
          if (inputRef.current) inputRef.current.value = itemValue;
          return;
        }
        !uncontrolled && setItemValue(processed);
        onChange?.(processed);
        // Always sync the DOM when a transformer is active: React may dedupe setState when
        // the filtered result equals the previous value, leaving raw input visible.
        if (inputRef.current) inputRef.current.value = processed;
        return;
      }
      !uncontrolled && setItemValue(val);
      onChange?.(val);
      if (updateInputRefValue && inputRef.current) {
        inputRef.current.value = val;
      }
    },
    [onChange, setItemValue, uncontrolled, valueTransformer, itemValue],
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

  const classNames = sanitizeModuleRootClasses(styles, className, [
    size,
    disabled ? "disabled" : error ? "error" : success && "success",
    readOnly && "readOnly",
    pill && "pill",
    clearable && itemValue && "clearable",
  ]);

  return (
    <div className={classNames} ref={ref} data-testid="inputItem" style={style}>
      {iconLeft && <GlobalIconWrapper icon={iconLeft} className={styles.icon} size={size} />}
      <div className={styles.inputWrapper}>
        <input
          id={id}
          type={type}
          inputMode={inputMode}
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
          onBlur={onBlur}
          {...controlledProps}
        />
        {!disabled && !readOnly && clearable && itemValue && (
          <MotifIconButton name="cancel_outline" size={size} onClick={clearHandler} className={styles.clearButton} />
        )}
      </div>
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
          {iconRight && <GlobalIconWrapper icon={iconRight} className={styles.icon} size={size} />}
          {buttonRight && <MotifIconButton name={buttonRight.name} className={styles.icon} size={size} onClick={buttonRight.onClick} />}
        </>
      )}
      {numberSpinner && (
        <NumberSpinner
          value={itemValue}
          min={numberSpinner.min}
          max={numberSpinner.max}
          step={numberSpinner.step}
          disabled={disabled || readOnly}
          onChange={changeProcess}
        />
      )}
    </div>
  );
};

InputText.displayName = "InternalInputText";
export default InputText;
