"use client";

import styles from "./Radio.module.scss";
import { useCallback, useEffect, useId, useState } from "react";
import { useRadioGroupContext } from "@/components/RadioGroup/RadioGroupContext";
import { PropsWithRef } from "../../types";
import { RadioProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";

const Radio = (props: PropsWithRef<RadioProps, HTMLDivElement>) => {
  const groupContext = useRadioGroupContext();
  const { label, checked = false, onChange, value, ref, style, className } = usePropsWithThemeDefaults("Radio", props);
  if (groupContext && props.name && groupContext.name !== props.name) {
    throw new Error(
      `When Radio is used inside RadioGroup, either the name props should match or there should be no name prop given for Radio components!\n\n RadioGroup name: ${groupContext.name}\n Radio name: ${props.name}`,
    );
  }

  const disabled = groupContext?.disabled || props.disabled;
  const success = groupContext?.success || props.success;
  const readOnly = groupContext?.readOnly || props.readOnly;
  const error = groupContext?.error || props.error;
  const name = groupContext?.name || props.name;
  const size = groupContext?.size || props.size || "md";
  const [isChecked, setIsChecked] = useState(groupContext ? groupContext.selectedValue === value : checked);
  const id = useId();

  useEffect(() => setIsChecked(checked), [checked]);

  useEffect(() => {
    groupContext && setIsChecked(groupContext.selectedValue === value);
  }, [groupContext, value]);

  const radioClassname = sanitizeModuleRootClasses(styles, className, [
    size,
    disabled || readOnly ? "disabled" : error ? "error" : success && "success",
  ]);

  const changeHandler = useCallback(() => {
    if (readOnly) return;
    groupContext ? groupContext.setSelectedValue?.(value) : setIsChecked(prev => !prev);
    onChange?.(true);
    groupContext?.onGroupChange?.(value);
  }, [groupContext, onChange, readOnly, value]);

  return (
    <div className={radioClassname} style={style} ref={ref} data-testid="radioItem">
      <input
        id={id}
        value={value}
        name={name}
        className={styles.radio}
        type="radio"
        onChange={changeHandler}
        checked={isChecked}
        disabled={disabled}
        readOnly={readOnly}
      />
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
    </div>
  );
};

Radio.displayName = "Radio";
export default Radio;
