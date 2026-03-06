"use client";

import styles from "./Checkbox.module.scss";
import { useCallback, useEffect, useId, useState } from "react";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import { PropsWithRef } from "../../types";
import { CheckboxProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";

const Checkbox = (p: PropsWithRef<CheckboxProps, HTMLDivElement>) => {
  const props = usePropsWithThemeDefaults("Checkbox", p);
  const { label, partialCheck, checked = false, onChange, ref, style, className } = props;
  const [isChecked, setIsChecked] = useState(checked);
  const { size, error, readOnly, success, disabled, onFormFieldValueUpdate, inFormField, name } = useRegisterFormField({
    props: { ...props, value: !!props.checked },
    defaultValue: false,
    valueStateSetter: setIsChecked,
  });
  const id = useId();

  useEffect(() => {
    setIsChecked(checked);
    onFormFieldValueUpdate?.(checked);
  }, [checked, onFormFieldValueUpdate]);

  const handleChange = useCallback(() => {
    if (readOnly) return;
    onChange?.(!isChecked);
    setIsChecked(!isChecked);
    onFormFieldValueUpdate?.(!isChecked);
  }, [isChecked, onChange, onFormFieldValueUpdate, readOnly]);

  const classNames = sanitizeModuleRootClasses(styles, className, [
    size,
    partialCheck && !isChecked && "partialCheck",
    disabled || readOnly ? "disabled" : error && "error",
    success && "success",
    inFormField && "inFormField",
  ]);

  return (
    <div className={classNames} style={style} ref={ref} data-testid="checkbox">
      <input
        name={name}
        id={id}
        type="checkbox"
        className={styles.input}
        onChange={handleChange}
        disabled={disabled}
        readOnly={readOnly}
        checked={isChecked}
      />
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
    </div>
  );
};

Checkbox.displayName = "Checkbox";
export default Checkbox;
