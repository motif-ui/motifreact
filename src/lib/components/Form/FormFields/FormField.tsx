"use client";

import { useMemo, useState } from "react";
import styles from "./FormField.module.scss";
import { useForm } from "@/components/Form/context/FormContext";
import { FieldProvider } from "@/components/Form/context/FieldContext";
import { PropsWithRef } from "../../../types";
import { FormFieldProps } from "@/components/Form/FormFields/types";
import { sanitizeModuleRootClasses } from "../../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../../motif/hooks/usePropsWithThemeDefaults";

const FormField = (props: PropsWithRef<FormFieldProps, HTMLDivElement>) => {
  const formContext = useForm();
  if (!formContext) {
    throw new Error("FormField must be used inside a Form component");
  }

  const { label, helperText, name, children, validations, success, disabled, readOnly, ref, style, className } = usePropsWithThemeDefaults(
    "FormField",
    props,
  );
  const { size, formOrientation, labelOrientation } = formContext;
  const [error, setError] = useState<string>();

  const isRequired = validations?.some(validation => validation.requiredValidation);

  const classNames = useMemo(
    () =>
      sanitizeModuleRootClasses(styles, className, [
        size,
        formOrientation + "Form",
        labelOrientation + "Label",
        isRequired && "required",
        error ? "error" : disabled || readOnly ? "disabled" : success && "success",
      ]),
    [className, disabled, error, formOrientation, isRequired, labelOrientation, readOnly, size, success],
  );

  return (
    <FieldProvider
      fieldName={name}
      validations={validations}
      disabled={disabled}
      readOnly={readOnly}
      success={success}
      setFieldError={setError}
      error={!!error}
    >
      <div className={classNames} ref={ref} data-testid="formField" {...(label && { "data-has-label": "" })} style={style}>
        {label && <span className={styles.label}>{label}</span>}
        <div className={styles.inputContainer}>
          {children}
          <span className={styles.helper}>{error ?? (helperText || "")}</span>
        </div>
      </div>
    </FieldProvider>
  );
};

FormField.displayName = "FormField";
export default FormField;
