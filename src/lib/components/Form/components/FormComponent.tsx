"use client";

import { FormEvent, useCallback, useImperativeHandle, useRef } from "react";
import { FormContextType, FormRefType, FormSubmitData, NameInputValue } from "@/components/Form/types";
import { useForm } from "@/components/Form/context/FormContext";
import styles from "../Form.module.scss";
import Button from "@/components/Button";
import FormTitle from "@/components/Form/components/FormTitle";
import { PropsWithRefAndChildren } from "../../../types";
import { sanitizeModuleRootClasses } from "../../../../utils/cssUtils";

type Props<T> = {
  submitButtonLabel: string;
  buttonPosition: "left" | "center" | "right";
  enableClearButton?: boolean;
  clearButtonLabel: string;
  dontClearOnSubmit?: boolean;
  onSubmit: (data: FormSubmitData<T>, event: FormEvent<HTMLFormElement>) => void;
  title?: string;
};

const FormComponent = <T extends NameInputValue>(props: PropsWithRefAndChildren<Props<T>, FormRefType>) => {
  const {
    children,
    onSubmit,
    submitButtonLabel,
    buttonPosition,
    clearButtonLabel,
    enableClearButton,
    dontClearOnSubmit,
    title,
    ref,
    className,
    style,
  } = props;
  const { size, formOrientation, labelOrientation, validate, resetValues } = useForm() as FormContextType<T>;

  const internalFormRef = useRef<HTMLFormElement>(null);
  useImperativeHandle(ref, () => ({
    ...internalFormRef.current!,
    clearForm: resetValues,
  }));

  const submitHandler = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = validate();
      onSubmit(data, event);
      !dontClearOnSubmit && data.isValid && resetValues();
    },
    [dontClearOnSubmit, onSubmit, resetValues, validate],
  );

  const classNames = sanitizeModuleRootClasses(styles, className, [size, formOrientation, labelOrientation + "Labels"]);

  return (
    <form onSubmit={submitHandler} className={classNames} ref={internalFormRef} style={style}>
      {title && <FormTitle title={title} size={size} />}
      <div className={styles.fields}>
        {children}
        <div className={`${styles.submitArea} ${styles["submitArea_align_" + buttonPosition]}`}>
          {enableClearButton && <Button label={clearButtonLabel} size={size} variant="secondary" onClick={resetValues} />}
          <Button label={submitButtonLabel} size={size} htmlType="submit" />
        </div>
      </div>
    </form>
  );
};

export default FormComponent;
