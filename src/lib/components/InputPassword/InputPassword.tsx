"use client";

import styles from "./InputPassword.module.scss";
import { useRef, useState } from "react";
import { MotifIcon } from "@/components/Motif/Icon";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import { PropsWithRef } from "../../types";
import { InputPasswordProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "src/utils/cssUtils.ts";
import InputText from "@/components/Motif/InputText/InputText.tsx";
import { InternalInputHandle } from "@/components/Motif/InputText/types.ts";

const InputPassword = (p: PropsWithRef<InputPasswordProps, HTMLDivElement>) => {
  const { iconLeft, toggleMask, ...props } = usePropsWithThemeDefaults("InputPassword", p);
  const internalInputRef = useRef<InternalInputHandle>(null);
  const { onFormFieldValueUpdate, ...propsFromForm } = useRegisterFormField({
    props,
    defaultValue: "",
    valueStateSetter: () => internalInputRef.current?.valueStateSetter(""),
  });

  const [showPassword, setShowPassword] = useState(false);

  const classNames = sanitizeModuleRootClasses(styles, props.className);

  return (
    <InputText
      {...props}
      {...propsFromForm}
      value={props.value as string}
      onValueUpdated={onFormFieldValueUpdate}
      imperativeRef={internalInputRef}
      className={classNames}
      buttonRight={
        toggleMask
          ? {
              name: showPassword ? "visibility_off" : "visibility",
              onClick: () => setShowPassword(p => !p),
            }
          : undefined
      }
      iconLeft={iconLeft ?? <MotifIcon name="vpn_key" />}
      type={showPassword ? "text" : "password"}
    />
  );
};

InputPassword.displayName = "InputPassword";
export default InputPassword;
