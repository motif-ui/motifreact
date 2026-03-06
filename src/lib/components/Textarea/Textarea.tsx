"use client";
import styles from "./Textarea.module.scss";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import { PropsWithRef } from "../../types";
import { TextareaProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";

const Textarea = (p: PropsWithRef<TextareaProps, HTMLDivElement>) => {
  const props = usePropsWithThemeDefaults("Textarea", p);
  const { placeholder, maxLength, rows = 4, style, value = "", onChange, ref, className } = props;
  const [itemValue, setItemValue] = useState(value as string);
  const { size, error, readOnly, success, disabled, onFormFieldValueUpdate, name, inFormField } = useRegisterFormField({
    props,
    defaultValue: "",
    valueStateSetter: setItemValue,
  });
  const valueStr = value as string;
  const hasMaxLength = maxLength !== undefined && maxLength >= 0;

  useEffect(() => {
    const limitedValue = hasMaxLength && valueStr && valueStr.length > maxLength ? valueStr.substring(0, maxLength) : valueStr;
    setItemValue(limitedValue);
    onFormFieldValueUpdate?.(limitedValue);
  }, [hasMaxLength, maxLength, onFormFieldValueUpdate, valueStr]);

  const changeHandler = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setItemValue(val);
      onChange?.(val);
      onFormFieldValueUpdate?.(val);
    },
    [onChange, onFormFieldValueUpdate],
  );

  const classNames = sanitizeModuleRootClasses(styles, className, [
    size,
    inFormField && "inFormField",
    hasMaxLength && "hasCounter",
    disabled || readOnly ? "disabled" : error ? "error" : success && "success",
  ]);

  return (
    <div className={classNames} ref={ref} style={style}>
      <textarea
        name={name}
        data-testid="textareaItem"
        className={styles.textArea}
        placeholder={placeholder}
        value={itemValue}
        readOnly={readOnly}
        disabled={disabled}
        maxLength={maxLength}
        rows={rows}
        onChange={changeHandler}
      />
      {hasMaxLength && (
        <span className={styles.counterArea}>
          {itemValue.length || 0}/{maxLength}
        </span>
      )}
    </div>
  );
};

Textarea.displayName = "Textarea";
export default Textarea;
