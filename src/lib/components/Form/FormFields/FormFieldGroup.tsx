"use client";

import { useMemo, useState } from "react";
import styles from "./FormField.module.scss";
import { useForm } from "@/components/Form/context/FormContext";
import { FieldProvider } from "@/components/Form/context/FieldContext";
import { PropsWithRefAndChildren } from "../../../types";
import { FormFieldGroupProps } from "@/components/Form/FormFields/types";
import usePropsWithThemeDefaults from "../../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../../utils/cssUtils";

const FormFieldGroup = (props: PropsWithRefAndChildren<FormFieldGroupProps, HTMLDivElement>) => {
  const formContext = useForm();
  if (!formContext) {
    throw new Error("FormFieldGroup must be used inside a Form component");
  }
  const {
    name,
    label,
    helperText,
    orientation = "horizontal",
    groupValidations,
    children,
    disabled,
    readOnly,
    success,
    ref,
    className,
    style,
  } = usePropsWithThemeDefaults("FormFieldGroup", props);
  const { size, formOrientation, labelOrientation } = formContext;
  const [error, setError] = useState<string>();

  const isRequired = groupValidations?.some(validation => validation.requiredValidation);

  const classNames = useMemo(
    () =>
      sanitizeModuleRootClasses(styles, className, [
        size,
        formOrientation + "Form",
        labelOrientation + "Label",
        orientation + "Group",
        isRequired && "required",
        error ? "error" : disabled || readOnly ? "disabled" : success && "success",
      ]),
    [className, disabled, error, formOrientation, isRequired, labelOrientation, orientation, readOnly, size, success],
  );

  return (
    <FieldProvider
      fieldName={name}
      validations={groupValidations}
      groupName={name}
      success={success}
      readOnly={readOnly}
      disabled={disabled}
      setFieldError={setError}
      error={!!error}
    >
      <div className={classNames} data-testid="formFieldGroup" ref={ref} style={style} {...(label && { "data-has-label": "" })}>
        {label && <span className={styles.label}>{label}</span>}
        <div className={styles.inputContainer}>
          <div className={styles.groupItems}>{children}</div>
          <span className={styles.helper}>{error ?? (helperText || "")}</span>
        </div>
      </div>
    </FieldProvider>
  );
};

FormFieldGroup.displayName = "FormFieldGroup";
export default FormFieldGroup;
