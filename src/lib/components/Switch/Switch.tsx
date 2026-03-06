"use client";

import styles from "./Switch.module.scss";
import { useCallback, useEffect, useState, useId } from "react";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import { PropsWithRef } from "../../types";
import { SwitchProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";

const Switch = (p: PropsWithRef<SwitchProps, HTMLDivElement>) => {
  const props = usePropsWithThemeDefaults("Switch", p);
  const { label, checked = false, onChange, ref, className, style } = props;
  const [isChecked, setIsChecked] = useState(checked);
  const { size, readOnly, disabled, onFormFieldValueUpdate, inFormField, name } = useRegisterFormField({
    props: { ...props, value: !!props.checked },
    defaultValue: false,
    valueStateSetter: setIsChecked,
  });

  const id = useId();
  useEffect(() => {
    setIsChecked(checked);
    onFormFieldValueUpdate?.(checked);
  }, [checked, onFormFieldValueUpdate]);

  const handleSlider = useCallback(() => {
    if (readOnly) return;
    onChange?.(!isChecked);
    setIsChecked(!isChecked);
    onFormFieldValueUpdate?.(!isChecked);
  }, [isChecked, onChange, onFormFieldValueUpdate, readOnly]);

  const classNames = sanitizeModuleRootClasses(styles, className, [
    size,
    inFormField && "inFormField",
    (disabled || readOnly) && "disabled",
    isChecked && "checked",
  ]);

  return (
    <div className={classNames} ref={ref} style={style}>
      <input type="checkbox" id={id} name={name} checked={isChecked} disabled={disabled} onChange={handleSlider} data-testid="switchItem" />
      <span className={styles.slider} onClick={handleSlider} data-testid="switchSliderItem" />
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
    </div>
  );
};

Switch.displayName = "Switch";
export default Switch;
