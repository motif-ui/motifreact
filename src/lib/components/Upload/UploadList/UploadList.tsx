"use client";
import styles from "./UploadList.module.scss";
import { useCallback } from "react";
import FileList from "@/components/Upload/UploadFileList/FileList";
import { UploadProvider } from "@/components/Upload/UploadProvider";
import DragArea from "@/components/Upload/UploadList/DragArea";
import { InputValue } from "../../Form/types";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import { PropsWithRef } from "../../../types";
import usePropsWithThemeDefaults from "../../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../../utils/cssUtils";
import { UploadListProps } from "./types";

const UploadList = (p: PropsWithRef<UploadListProps, HTMLDivElement>) => {
  const props = usePropsWithThemeDefaults("UploadList", p);

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
      <div className={classes} style={style} ref={ref}>
        <DragArea disabled={disabled || readOnly} error={error} success={success} onChange={changeHandler} onError={onError} />
        <FileList disabled={disabled} readOnly={readOnly} />
      </div>
    </UploadProvider>
  );
};

UploadList.displayName = "UploadList";
export default UploadList;
