"use client";
import styles from "./UploadInput.module.scss";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { useMotifContext } from "../../../motif/context/MotifProvider";
import { InputState, UploadProps } from "../types";
import { STATUS } from "@/components/Upload/constants";
import { UploadContext, UploadProvider } from "@/components/Upload/UploadProvider";
import { LabelArea } from "@/components/Upload/UploadInput/components/LabelArea";
import useDeepCompareEffect from "use-deep-compare-effect";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import { Validations } from "@/components/Form";
import { PropsWithRef } from "../../../types";
import { UploadInputProps, UploadInputWrapperProps } from "./types";
import usePropsWithThemeDefaults from "../../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../../utils/cssUtils";
import { MotifIcon } from "@/components/Motif/Icon";

const UploadInput = (p: PropsWithRef<UploadInputProps, HTMLDivElement>) => {
  const props = usePropsWithThemeDefaults("UploadInput", p);
  const { autoUpload, accept, maxSize, maxFile, messages, uploadRequest, deleteRequest, customValidation, ...inputCommonProps } = props;

  const { size, error, success, onError, disabled, readOnly, onFormFieldValueUpdate, inFormField, name, onChange } = useRegisterFormField({
    props: inputCommonProps,
    defaultValue: undefined,
    defaultValidations: [Validations.UploadItemSyncValidation],
    nonClearable: true,
  });

  const uploadProps: UploadProps = {
    autoUpload,
    accept,
    maxSize,
    maxFile,
    messages,
    uploadRequest,
    deleteRequest,
    customValidation,
  };
  const inputCommonPropsAfterRegister = {
    size,
    error,
    success,
    onError,
    disabled,
    readOnly,
    name,
    onFormFieldValueUpdate,
    inFormField,
    onChange,
  };

  return (
    <UploadProvider props={uploadProps} isUploadInput name={name} disabled={disabled}>
      <UploadInputWrapper {...uploadProps} {...inputCommonPropsAfterRegister} />
    </UploadProvider>
  );
};

const UploadInputWrapper = (props: PropsWithRef<UploadInputWrapperProps, HTMLDivElement>) => {
  const { ref, onChange, disabled, size, success, error, onError, onFormFieldValueUpdate, inFormField, readOnly, style, className } = props;
  const {
    selectedFiles,
    browse,
    uploadProps: { autoUpload },
    uploadV2,
  } = useContext(UploadContext);
  const { t } = useMotifContext();

  const isDisabled = disabled || readOnly;

  const selectedFilesEqualityString = selectedFiles
    .map(f => f.id + f.file.name + f.file.size + f.file.type + f.status + (f.messages?.join("") || ""))
    .join(",");

  const errors = useMemo(
    () =>
      selectedFiles.reduce(
        (acc, file) =>
          (file.status === STATUS.CHECK_FAIL || file.status === STATUS.UPLOAD_FAIL || file.status === STATUS.DELETE_FAIL) &&
          file.messages?.length
            ? [...acc, ...file.messages.reduce((messages, err) => (!acc.includes(err) ? [...messages, err] : messages), [] as string[])]
            : acc,
        [] as string[],
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedFilesEqualityString],
  );

  const inputState: InputState = errors.length
    ? "error"
    : selectedFiles.some(f => f.status === STATUS.UPLOADING)
      ? "uploading"
      : selectedFiles.length && selectedFiles.every(f => f.status === STATUS.SUCCESS)
        ? "uploaded"
        : selectedFiles.some(f => f.status === STATUS.IDLE)
          ? "waitingToUpload"
          : "noFile";

  const styleVariant = isDisabled ? "disabled" : error || inputState === "error" ? "error" : success && "success";

  useEffect(() => {
    !readOnly && onChange?.(selectedFiles);
    onFormFieldValueUpdate?.(selectedFiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilesEqualityString, readOnly]);

  useDeepCompareEffect(() => {
    errors.length && onError?.(errors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  const isBrowseButtonDisabled =
    disabled || readOnly || !!selectedFiles.filter(f => f.status === STATUS.UPLOADING || f.status === STATUS.SUCCESS).length;
  const isUploadButtonDisabled = disabled || selectedFiles.some(f => f.status !== STATUS.IDLE);

  const uploadHandler = useCallback(() => uploadV2(selectedFiles, true), [selectedFiles, uploadV2]);

  const classNames = sanitizeModuleRootClasses(styles, className, [styleVariant, inFormField && "inFormField", size]);

  return (
    <div ref={ref} className={classNames} style={style} data-testid="uploadInputItem">
      <button className={styles.browseButton} onClick={browse} disabled={isBrowseButtonDisabled} type="button">
        <MotifIcon name="search" size={size} />
        {t("g.browse")}
      </button>
      <LabelArea disabled={isDisabled} size={size} errors={errors} inputState={inputState} success={success} error={error} />
      {!autoUpload && !!selectedFiles.length && (
        <button className={styles.uploadButton} disabled={isUploadButtonDisabled} onClick={uploadHandler} type="button">
          <MotifIcon name="upload_2" size={size} />
          {t("g.upload")}
        </button>
      )}
    </div>
  );
};

UploadInput.displayName = "UploadInput";
export default UploadInput;
