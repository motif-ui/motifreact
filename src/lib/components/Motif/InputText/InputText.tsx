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

  const [itemValue, setItemValue] = useState(() => valueTransformer?.(value) ?? value);
  const controlledProps = uncontrolled ? { defaultValue: value } : { value: itemValue };
  useEffect(() => {
    if (!uncontrolled && value !== prevValueRef.current) {
      const nextValue = valueTransformer?.(value) ?? value;
      prevValueRef.current = nextValue;
      setItemValue(nextValue);
      onValueUpdated?.(nextValue);
    }
  }, [onValueUpdated, uncontrolled, value, valueTransformer]);

  const changeProcess = useCallback(
    (typedValue: string, updateInputRefValue?: boolean) => {
      const inputEl = inputRef.current;

      if (valueTransformer) {
        // 1. Save current cursor positions
        const start = inputEl?.selectionStart ?? null;
        const end = inputEl?.selectionEnd ?? null;

        const processed = valueTransformer(typedValue);
        if (processed === undefined) {
          if (inputEl) inputEl.value = itemValue;
          return;
        }
        !uncontrolled && setItemValue(processed);
        onChange?.(processed);
        if (inputEl) {
          inputEl.value = processed;
          // 2. Restore cursor position if input value was modified
          if (start !== null && end !== null) {
            inputEl.setSelectionRange(start, end);
          }
        }
        return;
      }

      !uncontrolled && setItemValue(typedValue);
      onChange?.(typedValue);

      if (updateInputRefValue && inputEl) {
        inputEl.value = typedValue;
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
