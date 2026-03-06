"use client";

import Icon from "@/components/Icon";
import styles from "./InputPassword.module.scss";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { MotifIcon, MotifIconButton } from "@/components/Motif/Icon";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import { PropsWithRef } from "../../types";
import { InputPasswordProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";

const InputPassword = (p: PropsWithRef<InputPasswordProps, HTMLDivElement>) => {
  const props = usePropsWithThemeDefaults("InputPassword", p);
  const { placeholder, toggleMask, icon, pill, value = "", onChange, ref, className, style } = props;
  const [itemValue, setItemValue] = useState(value);
  const { size, error, readOnly, success, disabled, onFormFieldValueUpdate, name, inFormField } = useRegisterFormField({
    props,
    defaultValue: "",
    valueStateSetter: setItemValue,
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setItemValue(value);
    onFormFieldValueUpdate?.(value);
  }, [onFormFieldValueUpdate, value]);

  const changeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setItemValue(e.target.value);
      onChange?.(e.target.value);
      onFormFieldValueUpdate?.(e.target.value);
    },
    [onChange, onFormFieldValueUpdate],
  );

  const classNames = sanitizeModuleRootClasses(styles, className, [
    size,
    inFormField && "inFormField",
    pill && "pill",
    disabled || readOnly ? "disabled" : error ? "error" : success && "success",
  ]);

  return (
    <div className={classNames} ref={ref} data-testid="inputPassword" style={style}>
      <Icon className={styles.icon} size={size}>
        {icon ?? <MotifIcon name="vpn_key" />}
      </Icon>
      <input
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={itemValue as string}
        onChange={changeHandler}
        disabled={disabled}
        readOnly={readOnly}
      />
      {toggleMask && (
        <MotifIconButton
          name={showPassword ? "visibility_off" : "visibility"}
          className={`${styles.icon} ${styles.visibilityToggleIcon}`}
          size={size}
          onClick={() => setShowPassword(p => !p)}
        />
      )}
    </div>
  );
};

InputPassword.displayName = "InputPassword";
export default InputPassword;
