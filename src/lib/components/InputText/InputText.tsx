"use client";

import Icon from "../Icon/Icon";
import styles from "./InputText.module.scss";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import { PropsWithRef } from "../../types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import { InputTextProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";

const InputText = (p: PropsWithRef<InputTextProps, HTMLDivElement>) => {
  const props = usePropsWithThemeDefaults("InputText", p);
  const {
    placeholder,
    iconLeft = "",
    iconRight = "",
    pill,
    value = "",
    onChange,
    maxLength,
    ref,
    className,
    style,
    onClick,
    onFocus,
    readOnlyWithEnabledLook,
  } = props;

  const [itemValue, setItemValue] = useState(value);

  const { size, error, readOnly, success, disabled, onFormFieldValueUpdate, name, inFormField } = useRegisterFormField({
    props,
    defaultValue: "",
    valueStateSetter: setItemValue,
  });

  useEffect(() => {
    setItemValue(value);
    onFormFieldValueUpdate?.(value);
  }, [onFormFieldValueUpdate, value]);

  const changeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
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
    !!iconLeft && "has-icon-left",
    !!iconRight && "has-icon-right",
    disabled || readOnly ? "disabled" : error ? "error" : success && "success",
    pill && "pill",
  ]);

  return (
    <div className={classNames} ref={ref} data-testid="inputItem" style={style}>
      {iconLeft && (
        <Icon className={`${styles.icon} ${styles["icon-left"]}`} size={size}>
          {iconLeft}
        </Icon>
      )}
      <input
        name={name}
        placeholder={placeholder}
        value={itemValue as string}
        onChange={changeHandler}
        disabled={disabled}
        readOnly={readOnly || readOnlyWithEnabledLook}
        maxLength={maxLength}
        onClick={onClick}
        onFocus={onFocus}
      />
      {iconRight && (
        <Icon className={`${styles.icon} ${styles["icon-right"]}`} size={size}>
          {iconRight}
        </Icon>
      )}
    </div>
  );
};

InputText.displayName = "InputText";
export default InputText;
