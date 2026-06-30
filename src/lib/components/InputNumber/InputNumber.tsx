"use client";

import styles from "./InputNumber.module.scss";
import { useRef } from "react";
import type { FocusEvent } from "react";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import { PropsWithRef } from "../../types";
import { InputNumberProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "src/utils/cssUtils.ts";
import InputText from "@/components/Motif/InputText/InputText.tsx";
import { InternalInputHandle } from "@/components/Motif/InputText/types.ts";
import { applyNumberFilter } from "@/components/InputNumber/helper.ts";

const InputNumber = (p: PropsWithRef<InputNumberProps, HTMLDivElement>) => {
  const { removeSpinner, allowDecimals, allowNegative, decimalScale, min, max, maxLength, ...props } = usePropsWithThemeDefaults(
    "InputNumber",
    p,
  );
  const internalInputRef = useRef<InternalInputHandle>(null);
  const { onFormFieldValueUpdate, ...propsFromForm } = useRegisterFormField({
    props,
    defaultValue: "",
    valueStateSetter: () => internalInputRef.current?.valueStateSetter(""),
  });

  // Only used by handleBlur for programmatic value corrections (min/max clamping)
  const updateValue = (newValue: string) => {
    internalInputRef.current?.valueStateSetter(newValue);
    propsFromForm.onChange?.(newValue);
  };

  const filterValue = (value: string) => applyNumberFilter(value, allowDecimals, allowNegative, maxLength, max, decimalScale);

  /**
   * This is needed for a sample scenario below:
   *
   * min={20}
   *
   * To type 25, the user has to hit the 2 key first. But how do we know if the use actually wants to type 2 or 28? If
   * this is not checked on blur but onChange, this will lead to a situation that onChange will think that 2 is less
   * than 20 and try to complete the number to 20. But maybe the user wanted to just type 28? So, this check will
   * ensure this situation is solved.
   */
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === "") return;

    if (inputValue === "-") {
      updateValue("");
      return;
    }

    // Clean up trailing decimals (e.g., "45." becomes 45)
    const cleanNumericVal = Number(inputValue.endsWith(".") ? inputValue.slice(0, -1) : inputValue);

    // Enforce final MIN and MAX boundaries
    if (min !== undefined && cleanNumericVal < min) {
      updateValue(String(min));
    } else if (max !== undefined && cleanNumericVal > max) {
      updateValue(String(max));
    } else if (inputValue.endsWith(".")) {
      updateValue(String(cleanNumericVal));
    }
  };

  const classNames = sanitizeModuleRootClasses(styles, props.className);

  return (
    <InputText
      {...props}
      {...propsFromForm}
      value={props.value !== undefined ? String(props.value) : undefined}
      onValueUpdated={onFormFieldValueUpdate}
      valueTransformer={filterValue}
      onBlur={handleBlur}
      type="text"
      inputMode={allowDecimals ? "decimal" : "numeric"}
      numberSpinner={!removeSpinner ? { min: !allowNegative ? Math.max(0, min ?? 0) : min, max } : undefined}
      imperativeRef={internalInputRef}
      className={classNames}
    />
  );
};

InputNumber.displayName = "InputNumber";
export default InputNumber;
