import styles from "../PinCode.module.scss";
import type { KeyboardEvent, FocusEvent } from "react";
import { useCallback, useContext, useEffect } from "react";
import { PinCodeContext } from "../PinCodeContext";
import { PinCodeItemHOCProps } from "../types";
import { PropsWithRef } from "../../../types";
import { sanitizeModuleClasses } from "src/utils/cssUtils.ts";
import InputText from "@/components/Motif/InputText/InputText.tsx";

const PinCodeItemHOC = (props: PropsWithRef<PinCodeItemHOCProps, HTMLInputElement>) => {
  const { index, indexByWord, masked, space, value, ref } = props;
  const { readOnly, maskType, focusNextInput, onChange, letterCase, focusPreviousInput, disabled, error, success } =
    useContext(PinCodeContext);

  const setCaseSensitiveValue = useCallback(
    (val = "") => {
      const newValue = letterCase === "upper" ? val.toLocaleUpperCase() : letterCase === "lower" ? val.toLocaleLowerCase() : val;
      onChange(index, newValue);
      return newValue;
    },
    [index, letterCase, onChange],
  );

  useEffect(() => {
    letterCase && setCaseSensitiveValue(value);
  }, [letterCase, setCaseSensitiveValue, value]);

  const changeHandler = useCallback(
    (val?: string) => {
      const newValue = setCaseSensitiveValue(val);
      newValue.length === 1 && focusNextInput(index);
    },
    [focusNextInput, index, setCaseSensitiveValue],
  );

  const keyUpHandler = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      e.key.toLocaleLowerCase() === "backspace" && !value && focusPreviousInput(index, value);
    },
    [focusPreviousInput, index, value],
  );

  const focusHandler = value ? (e: FocusEvent<HTMLInputElement>) => e.currentTarget.select() : undefined;

  const disabledFinal = !!disabled || props.disabled;

  const classNames = sanitizeModuleClasses(styles, "input", space && "item_space");

  return space ? (
    <InputText disabled ref={ref} className={classNames} />
  ) : (
    <InputText
      className={classNames}
      maxLength={1}
      value={masked && disabledFinal ? (maskType === "number" ? String(indexByWord + 1) : "*") : value}
      readOnly={readOnly}
      disabled={disabledFinal}
      onChange={changeHandler}
      onFocus={focusHandler}
      onKeyUp={keyUpHandler}
      type={masked && maskType === "asterisks" ? "password" : "text"}
      ref={ref}
      error={error}
      success={success}
    />
  );
};

PinCodeItemHOC.displayName = "PinCodeItemHOC";
export default PinCodeItemHOC;
