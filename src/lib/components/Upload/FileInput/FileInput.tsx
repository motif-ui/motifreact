"use client";
import styles from "@/components/Upload/UploadInput/UploadInput.module.scss";
import { useEffect, useRef, useState } from "react";
import { useMotifContext } from "../../../motif/context/MotifProvider";
import usePropsWithThemeDefaults from "../../../motif/hooks/usePropsWithThemeDefaults";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import { STATUS } from "@/components/Upload/constants";
import { getFileErrors, isFileFailed } from "@/components/Upload/helper";
import { FileType } from "@/components/Upload/types";
import { MotifIcon } from "@/components/Motif/Icon";
import { sanitizeModuleRootClasses } from "../../../../utils/cssUtils";
import { generateUUIDV4 } from "../../../../utils/utils";
import { PropsWithRef } from "../../../types";
import { FileInputProps } from "./types";
import { LabelArea } from "./components/LabelArea";

const FileInput = (p: PropsWithRef<FileInputProps, HTMLDivElement>) => {
  const props = usePropsWithThemeDefaults("FileInput", p);
  const {
    accept,
    maxFile = 1,
    maxSize,
    messages,
    customValidation,
    onChange: onChangeProp,
    ref,
    style,
    className,
    ...inputCommonProps
  } = props;
  const { t } = useMotifContext();
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileType[]>([]);

  const { size, error, success, disabled, readOnly, name, onChange, onError } = useRegisterFormField({
    props: { ...inputCommonProps, onChange: onChangeProp && (files => onChangeProp((files as File[] | undefined) ?? [])) },
    defaultValue: [],
    valueStateSetter: setSelectedFiles,
  });

  const checkFiles = (files: FileType[]) =>
    files.reduce((acc, f) => {
      const errors = getFileErrors(
        f.file,
        acc.filter(c => !isFileFailed(c)).length,
        { accept, maxFile, maxSize, messages, customValidation },
        t,
      );
      return [...acc, errors.length ? { ...f, status: STATUS.CHECK_FAIL, messages: errors } : f];
    }, [] as FileType[]);
  const toValidFiles = (files: FileType[]) => files.filter(f => !isFileFailed(f)).map(f => f.file as File);
  const toErrors = (files: FileType[]) => [...new Set(files.flatMap(f => f.messages ?? []))];

  const checkedFiles = checkFiles(selectedFiles);
  const validFiles = toValidFiles(checkedFiles);
  const errors = toErrors(checkedFiles);
  const validFilesEqualityString = validFiles.map(f => f.name + f.size + f.type).join(",");

  const updateFiles = (files: FileType[]) => {
    setSelectedFiles(files);
    const checked = checkFiles(files);
    // onChange first: the form clears the field's own error on every value change
    onChange?.(toValidFiles(checked));
    const fileErrors = toErrors(checked);
    fileErrors.length && onError?.(fileErrors);
  };

  const addNewFiles = (files: FileList | null) => {
    if (disabled || readOnly || !files?.length) return;
    updateFiles(Array.from(files).map(file => ({ file, id: generateUUIDV4(), status: STATUS.IDLE })));
  };

  useEffect(() => {
    const input = hiddenInputRef.current;
    if (!input) return;
    if (typeof DataTransfer === "undefined") {
      !validFiles.length && (input.value = "");
      return;
    }
    const dataTransfer = new DataTransfer();
    validFiles.forEach(file => dataTransfer.items.add(file));
    input.files = dataTransfer.files;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validFilesEqualityString]);

  const browse = () => hiddenInputRef.current?.click();

  const styleVariant = disabled ? "disabled" : readOnly ? "readOnly" : error || errors.length ? "error" : success && "success";
  const classNames = sanitizeModuleRootClasses(styles, className, [styleVariant, size]);

  return (
    <div ref={ref} className={classNames} style={style} data-testid="fileInput" data-mtf-component="file-input">
      <input
        ref={hiddenInputRef}
        type="file"
        hidden
        name={name}
        disabled={disabled}
        accept={accept?.join(",")}
        multiple={maxFile > 1}
        onChange={e => addNewFiles(e.target.files)}
      />
      <button className={styles.browseButton} onClick={browse} disabled={disabled || readOnly} type="button">
        <MotifIcon name="search" size={size} />
        {t("g.browse")}
      </button>
      <LabelArea
        files={selectedFiles}
        errors={errors}
        size={size}
        disabled={disabled}
        readOnly={readOnly}
        error={error}
        success={success}
        onBrowse={browse}
        onClear={() => updateFiles([])}
      />
    </div>
  );
};

FileInput.displayName = "FileInput";
export default FileInput;
