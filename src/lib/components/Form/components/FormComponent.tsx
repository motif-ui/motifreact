"use client";

import { FormEvent, useCallback, useImperativeHandle, useRef, ReactElement, cloneElement } from "react";
import { FormContextType, FormRefType, FormSubmitData, NameInputValue } from "@/components/Form/types";
import { ButtonProps } from "@/components/Button/types";
import { useForm } from "@/components/Form/context/FormContext";
import styles from "../Form.module.scss";
import Button from "@/components/Button";
import FormTitle from "@/components/Form/components/FormTitle";
import { PropsWithRefAndChildren } from "../../../types";
import { sanitizeModuleRootClasses } from "src/utils/cssUtils.ts";

type Props<T> = {
  submitButtonLabel: string;
  buttonPosition: "left" | "center" | "right";
  fluidButtons?: boolean;
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
    fluidButtons,
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
  const submitAreaClassNames = [styles.submitArea, styles["submitArea_align_" + buttonPosition], fluidButtons && styles.submitArea_fluid]
    .filter(Boolean)
    .join(" ");
  const maybeButtonContainer = !preview && (enableClearButton || onSubmit || alternateButtons?.length);

  return (
    <form onSubmit={submitHandler} className={classNames} ref={internalFormRef} style={style}>
      {title && <FormTitle title={title} size={size} />}
      <div className={styles.fields}>
        {children}
        {maybeButtonContainer && (
          <div className={submitAreaClassNames}>
            {alternateButtons?.map(button => cloneElement(button, { size, ...(fluidButtons && { fluid: true }) }))}
            {enableClearButton && (
              <Button label={clearButtonLabel} size={size} variant="secondary" onClick={resetValues} fluid={fluidButtons} />
            )}
            {onSubmit && <Button label={submitButtonLabel} size={size} htmlType="submit" fluid={fluidButtons} />}
          </div>
        )}
      </div>
    </form>
  );
};

export default FormComponent;
