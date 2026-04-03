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
    className,
    style,
  } = props;

  const { size, error, readOnly, success, disabled, onError, onFormFieldValueUpdate, inFormField } = useRegisterFormField({
    props,
    defaultValue: [],
    nonClearable: true,
  });

  const changeHandler = useCallback(
    (value: InputValue) => {
      onChange?.(value);
      onFormFieldValueUpdate?.(value);
    },
    [onChange, onFormFieldValueUpdate],
  );

  const classes = sanitizeModuleRootClasses(styles, className, [inFormField && "inFormField", size]);

  return (
    <UploadProvider
      props={{ autoUpload, accept, maxSize, maxFile, messages, uploadRequest, deleteRequest, customValidation }}
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
