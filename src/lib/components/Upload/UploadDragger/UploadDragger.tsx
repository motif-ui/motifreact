"use client";
import { useCallback } from "react";
import FileList from "@/components/Upload/UploadFileList/FileList";
import { UploadProvider } from "@/components/Upload/UploadProvider";
import DragArea from "@/components/Upload/UploadDragger/components/DragArea";
import { sanitizeModuleRootClasses } from "../../../../utils/cssUtils";
import styles from "./UploadDragger.module.scss";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import { InputValue } from "../../Form/types";
import { PropsWithRef } from "../../../types";
import { UploadDraggerProps } from "./types";
import usePropsWithThemeDefaults from "../../../motif/hooks/usePropsWithThemeDefaults";
import { Validations } from "src/lib";
import { mapExternalValue, toFormValue } from "@/components/Upload/helper.ts";
import { FileType } from "@/components/Upload/types.ts";

const UploadDragger = (p: PropsWithRef<UploadDraggerProps, HTMLDivElement>) => {
  const props = usePropsWithThemeDefaults("UploadDragger", p);

  const {
    autoUpload,
    accept,
    maxSize,
    maxFile,
    messages,
    uploadRequest,
    deleteRequest,
    name,
    onChange,
    ref,
    customValidation,
    value: externalValue,
    className,
    style,
  } = props;
  const mappedValue = mapExternalValue(externalValue);

  const { size, error, readOnly, success, disabled, onError, onFormFieldValueUpdate } = useRegisterFormField({
    props: { ...props, value: toFormValue(mappedValue) },
    defaultValue: [],
    defaultValidations: [Validations.UploadItemSyncValidation],
    nonClearable: true,
  });

  const changeHandler = useCallback(
    (val: InputValue) => {
      const sanitizedValue = toFormValue(val as FileType[]);
      onChange?.(sanitizedValue);
      onFormFieldValueUpdate?.(sanitizedValue);
    },
    [onChange, onFormFieldValueUpdate],
  );

  const classes = sanitizeModuleRootClasses(styles, className, [size]);

  return (
    <UploadProvider
      props={{ autoUpload, accept, maxSize, maxFile, messages, uploadRequest, deleteRequest, customValidation }}
      value={mappedValue}
      size={size}
      name={name}
      disabled={disabled}
    >
      <div className={classes} style={style} ref={ref} data-testid="uploadDragger">
        <DragArea disabled={disabled || readOnly} error={error} success={success} onChange={changeHandler} onError={onError} />
        <FileList disabled={disabled} readOnly={readOnly} />
      </div>
    </UploadProvider>
  );
};

UploadDragger.displayName = "UploadDragger";
export default UploadDragger;
