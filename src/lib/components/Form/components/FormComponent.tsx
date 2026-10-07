"use client";

import { FormEvent, useCallback, useImperativeHandle, useRef, ReactElement, cloneElement } from "react";
import { FormContextType, FormRefType, FormSubmitData, NameInputValue } from "@/components/Form/types";
import { ButtonProps } from "@/components/Button/types";
import { useForm } from "@/components/Form/context/FormContext";
import styles from "../Form.module.scss";
import Button from "@/components/Button";
import FormTitle from "@/components/Form/components/FormTitle";
import { PropsWithRefAndChildren } from "../../../types";
import { sanitizeModuleClasses, sanitizeModuleRootClasses } from "src/utils/cssUtils.ts";

type Props<T> = {
  submitButtonLabel: string;
  buttonPosition: "left" | "center" | "right" | "fluid";
  enableClearButton?: boolean;
  clearButtonLabel: string;
  resetIfValidatedOnSubmit?: boolean;
  onSubmit?: (data: FormSubmitData<T>, event: FormEvent<HTMLFormElement>) => void;
  title?: string;
  alternateButtons?: ReactElement<ButtonProps>[];
};

const FormComponent = <T extends NameInputValue>(props: PropsWithRefAndChildren<Props<T>, FormRefType>) => {
  const {
    children,
    onSubmit,
    submitButtonLabel,
    buttonPosition,
    clearButtonLabel,
    enableClearButton,
    resetIfValidatedOnSubmit,
    title,
    alternateButtons,
    ref,
    className,
    style,
  } = props;
  const { size, formOrientation, labelOrientation, validate, resetValues, preview } = useForm() as FormContextType<T>;

  const internalFormRef = useRef<HTMLFormElement>(null);
  useImperativeHandle(ref, () => Object.assign(internalFormRef.current!, { clearForm: resetValues }));

  const submitHandler = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = validate();
      onSubmit?.(data, event);
      resetIfValidatedOnSubmit && data.isValid && resetValues();
    },
    [resetIfValidatedOnSubmit, onSubmit, resetValues, validate],
  );

  const classNames = sanitizeModuleRootClasses(styles, className, [size, formOrientation, labelOrientation + "Labels"]);
  const maybeButtonContainer = !preview && (enableClearButton || onSubmit || alternateButtons?.length);
  const fluid = buttonPosition === "fluid";

  return (
    <form onSubmit={submitHandler} className={classNames} ref={internalFormRef} style={style}>
      {title && <FormTitle title={title} size={size} />}
      <div className={styles.fields}>
        {children}
        {maybeButtonContainer && (
          <div className={sanitizeModuleClasses(styles, "submitArea", `submitArea_align_${buttonPosition}`, fluid && "submitArea_fluid")}>
            {alternateButtons?.map(button => cloneElement(button, { size, ...(fluid && { fluid: true }) }))}
            {enableClearButton && <Button label={clearButtonLabel} size={size} variant="secondary" onClick={resetValues} fluid={fluid} />}
            {onSubmit && <Button label={submitButtonLabel} size={size} htmlType="submit" fluid={fluid} />}
          </div>
        )}
      </div>
    </form>
  );
};

export default FormComponent;
