"use client";

import GlobalIconWrapper from "@/components/Motif/GlobalIconWrapper/GlobalIconWrapper";
import styles from "./InputText.module.scss";
import { ChangeEvent, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { PropsWithRef } from "../../../types";
import { sanitizeModuleRootClasses } from "../../../../utils/cssUtils";
import { MotifIconButton } from "@/components/Motif/Icon";
import { InternalInputProps } from "@/components/Motif/InputText/types";
import NumberSpinner from "@/components/Motif/InputText/components/NumberSpinner.tsx";
import { useTextTransform } from "@/components/Motif/InputText/helper.ts";

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
    textTransform,
    ref,
    imperativeRef,
    className,
    style,
  } = props;

  const applyTextTransform = useTextTransform();
  const inputRef = useRef<HTMLInputElement>(null);
  const prevValueRef = useRef(value);
  const pendingSelectionRef = useRef<{ start: number; end: number } | null>(null);
  useImperativeHandle(imperativeRef, () => ({ valueStateSetter: setItemValue }));

  const [itemValue, setItemValue] = useState(value);
  const controlledProps = uncontrolled ? { defaultValue: value } : { value: itemValue };

  // React writes the transformed value to the DOM to keep the controlled input in sync, and
  // that native write resets the caret to the end whenever textTransform changes the typed
  // characters (e.g. lowercase -> uppercase), even though the length is unchanged. Restore
  // the caret right after that DOM write commits, before the browser paints.
  useLayoutEffect(() => {
    if (pendingSelectionRef.current && inputRef.current) {
      const { start, end } = pendingSelectionRef.current;
      inputRef.current.setSelectionRange(start, end);
      pendingSelectionRef.current = null;
    }
  }, [itemValue]);

  useEffect(() => {
    if (!uncontrolled && value !== prevValueRef.current) {
      prevValueRef.current = value;
      setItemValue(value);
      onValueUpdated?.(value);
    }
  }, [onValueUpdated, uncontrolled, value]);

  const changeProcess = useCallback(
    (typedVal: string, updateInputRefValue?: boolean) => {
      const val = textTransform ? applyTextTransform(typedVal, textTransform) : typedVal;
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
      const selectionStartBeforeWrite = textTransform && inputRef.current ? inputRef.current.selectionStart : null;
      const selectionEndBeforeWrite = textTransform && inputRef.current ? inputRef.current.selectionEnd : null;
      !uncontrolled && setItemValue(val);
      onChange?.(val);
      if (uncontrolled && (updateInputRefValue || textTransform) && inputRef.current) {
        const inputEl = inputRef.current;
        const { selectionStart, selectionEnd } = inputEl;
        const lengthDelta = val.length - inputEl.value.length;
        inputEl.value = val;
        if (selectionStart !== null && selectionEnd !== null) {
          inputEl.setSelectionRange(Math.max(0, selectionStart + lengthDelta), Math.max(0, selectionEnd + lengthDelta));
        }
      } else if (!uncontrolled && selectionStartBeforeWrite !== null && selectionEndBeforeWrite !== null) {
        pendingSelectionRef.current = { start: selectionStartBeforeWrite, end: selectionEndBeforeWrite };
      }
    },
    [onChange, setItemValue, uncontrolled, valueTransformer, itemValue, textTransform, applyTextTransform],
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
