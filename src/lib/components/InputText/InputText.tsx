"use client";

import styles from "./InputText.module.scss";
import { useRef } from "react";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import { PropsWithRef } from "../../types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import { InputTextProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import InternalInputText from "@/components/Motif/InputText/InputText";
import { InternalInputHandle } from "@/components/Motif/InputText/types";

const InputText = (p: PropsWithRef<InputTextProps, HTMLDivElement>) => {
  const props = usePropsWithThemeDefaults("InputText", p);
  const internalInputRef = useRef<InternalInputHandle>(null);
  const { inFormField, onFormFieldValueUpdate, ...propsFromForm } = useRegisterFormField({
    props,
    defaultValue: "",
    valueStateSetter: () => internalInputRef.current?.valueStateSetter(""),
  });

  const classNames = sanitizeModuleRootClasses(styles, props.className, [inFormField && "inFormField"]);

  return (
    <InternalInputText
      {...props}
      {...propsFromForm}
      value={props.value as string}
      onValueUpdated={onFormFieldValueUpdate}
      imperativeRef={internalInputRef}
      className={classNames}
    />
  );
};

InputText.displayName = "InputText";
export default InputText;
