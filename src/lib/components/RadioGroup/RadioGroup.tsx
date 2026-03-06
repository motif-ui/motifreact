"use client";

import styles from "./RadioGroup.module.scss";
import { useCallback, useEffect, useState } from "react";
import { RadioGroupProps } from "./types";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import { InputValue } from "../Form/types";
import { PropsWithRef } from "../../types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { RadioGroupContext } from "@/components/RadioGroup/RadioGroupContext";

const RadioGroup = (p: PropsWithRef<RadioGroupProps, HTMLDivElement>) => {
  const props = usePropsWithThemeDefaults("RadioGroup", p);
  const { orientation = "vertical", children, value, onChange, ref, className, style } = props;
  const [selectedValue, setSelectedValue] = useState(value);
  const { size, error, readOnly, success, disabled, onFormFieldValueUpdate, inFormField, name } = useRegisterFormField({
    props,
    defaultValue: undefined,
    valueStateSetter: setSelectedValue,
  });

  useEffect(() => {
    setSelectedValue(value as string);
    onFormFieldValueUpdate?.(value as string);
  }, [onFormFieldValueUpdate, value]);

  const changeHandler = useCallback(
    (value?: InputValue) => {
      onChange?.(value);
      onFormFieldValueUpdate?.(value);
    },
    [onChange, onFormFieldValueUpdate],
  );

  const contextValue = {
    name,
    selectedValue: selectedValue as string,
    setSelectedValue,
    disabled,
    onGroupChange: changeHandler,
    success,
    readOnly,
    error,
    size,
  };

  const classNames = sanitizeModuleRootClasses(styles, className, [orientation, size, inFormField && "inFormField"]);

  return (
    <div className={classNames} ref={ref} style={style}>
      <RadioGroupContext value={contextValue}>{children}</RadioGroupContext>
    </div>
  );
};

RadioGroup.displayName = "RadioGroup";
export default RadioGroup;
