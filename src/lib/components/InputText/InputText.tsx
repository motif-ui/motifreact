"use client";

import styles from "./InputText.module.scss";
import { useMemo, useRef } from "react";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import { PropsWithRef } from "../../types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import { InputTextProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import InternalInputText from "@/components/Motif/InputText/InputText";
import { InternalInputHandle } from "@/components/Motif/InputText/types";
import { applyTextTransform } from "@/components/Motif/InputText/helper.ts";
import { useMotifContext } from "src/lib/motif/context/MotifProvider.tsx";

const InputText = (p: PropsWithRef<InputTextProps, HTMLDivElement>) => {
  const { textTransform, ...props } = usePropsWithThemeDefaults("InputText", p);
  const { locale } = useMotifContext();
  const internalInputRef = useRef<InternalInputHandle>(null);
  const { inFormField, onFormFieldValueUpdate, ...propsFromForm } = useRegisterFormField({
    props,
    defaultValue: "",
    valueStateSetter: () => internalInputRef.current?.valueStateSetter(""),
  });

  const classNames = sanitizeModuleRootClasses(styles, props.className, [inFormField && "inFormField"]);

  const valueTransformer = useMemo(
    () => textTransform && ((v: string) => applyTextTransform(v, textTransform, locale)),
    [textTransform, locale],
  );

  return (
    <InternalInputText
      {...props}
      {...propsFromForm}
      value={props.value as string}
      onValueUpdated={onFormFieldValueUpdate}
      valueTransformer={valueTransformer}
      imperativeRef={internalInputRef}
      className={classNames}
    />
  );
};

InputText.displayName = "InputText";
export default InputText;
