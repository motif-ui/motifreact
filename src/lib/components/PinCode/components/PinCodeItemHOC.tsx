import styles from "../PinCode.module.scss";
import type { KeyboardEvent, FocusEvent } from "react";
import { ChangeEvent, useCallback, useContext, useEffect } from "react";
import { PinCodeContext } from "../PinCodeContext";
import { PinCodeItemHOCProps } from "../types";
import { PropsWithRef } from "../../../types";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

const PinCodeItemHOC = (props: PropsWithRef<PinCodeItemHOCProps, HTMLInputElement>) => {
  const { index, indexByWord, masked, space, value, ref } = props;
  const { readOnly, maskType, focusNextInput, size, onChange, letterCase, focusPreviousInput, disabled } = useContext(PinCodeContext);

  const setCaseSensitiveValue = useCallback(
    (val: string) => {
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
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = setCaseSensitiveValue(e.target.value);
      newValue.length === 1 && focusNextInput(index);
    },
    [focusNextInput, index, setCaseSensitiveValue],
  );

  const keyUpHandler = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      e.key === "Backspace" && !value && focusPreviousInput(index, value);
    },
    [focusPreviousInput, index, value],
  );

  const focusHandler = value ? (e: FocusEvent<HTMLInputElement>) => e.currentTarget.select() : undefined;

  const disabledFinal = !!disabled || props.disabled;

  const classNames = sanitizeModuleClasses(styles, "input", size, space && "item_space");

  return space ? (
    <input disabled ref={ref} className={classNames} data-testid="pinCodeItem" />
  ) : (
    <input
      className={classNames}
      maxLength={1}
      value={masked && disabledFinal ? (maskType === "number" ? indexByWord + 1 : "*") : value}
      readOnly={readOnly}
      disabled={disabledFinal}
      onChange={changeHandler}
      onFocus={focusHandler}
      onKeyUp={keyUpHandler}
      type={masked && maskType === "asterisks" ? "password" : "text"}
      ref={ref}
      data-testid="pinCodeItem"
    />
  );
};

PinCodeItemHOC.displayName = "PinCodeItemHOC";
export default PinCodeItemHOC;
