import styles from "./UploadList.module.scss";
import Button from "@/components/Button";
import { useContext, useEffect, useMemo, useRef } from "react";
import { useMotifContext } from "../../../motif/context/MotifProvider";
import { useUploadDragDrop } from "@/components/Upload/hooks/useUploadDragDrop";
import { MESSAGE, STATUS } from "@/components/Upload/constants";
import { UploadContext } from "@/components/Upload/UploadProvider";
import useDeepCompareEffect from "use-deep-compare-effect";
import { InputValue } from "../../Form/types";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

type Props = {
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  onChange?: (value?: InputValue) => void;
  onError?: (errors: string[]) => void;
};

const DragArea = ({ disabled, error, success, onChange, onError }: Props) => {
  const {
    selectedFiles,
    uploadProps: { maxFile, autoUpload },
    addNewFiles,
    browse,
    size,
  } = useContext(UploadContext);
  const { t } = useMotifContext();

  const isFirstRun = useRef(true);

  const maxFileReached = selectedFiles.filter(file => file.status === STATUS.IDLE || file.uploaded).length >= maxFile;
  const isUploading = selectedFiles.some(file => file.status === STATUS.UPLOADING);
  const isWaitingToUpload = selectedFiles.some(file => file.status === STATUS.IDLE);
  const isDisabled = disabled || isUploading || maxFileReached;

  const { handleDragOver, handleDragLeave, hovered, handleDrop } = useUploadDragDrop({
    disabled: isDisabled,
    onNewFilesAdded: addNewFiles,
  });
  const noFiles = !selectedFiles.length;
  const classes = sanitizeModuleClasses(
    styles,
    "dragArea",
    hovered && "onDrag",
    !noFiles && "flatBottom",
    isDisabled && "disabled",
    error ? "error" : success && "success",
  );

  const selectedFilesEqualityString = selectedFiles
    .map(f => f.id + f.file.name + f.file.size + f.file.type + f.status + (f.messages?.join("") || ""))
    .join(",");

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    onChange?.(selectedFiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange, selectedFilesEqualityString]);

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

  useDeepCompareEffect(() => {
    errors.length && onError?.(errors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  return (
    <div className={classes} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      <Button onClick={browse} disabled={isDisabled} label={t("upload.browse")} variant="primary" shape="solid" size={size} />
      <span className={styles.infoText}>
        {isUploading
          ? t(MESSAGE.FILES_BEING_UPLOADED)
          : hovered && maxFileReached
            ? t(MESSAGE.MAX_FILE, { maxFile })
            : !autoUpload && isWaitingToUpload
              ? t(MESSAGE.WAITING_TO_UPLOAD)
              : t(MESSAGE.PLEASE_DROP)}
      </span>
    </div>
  );
};

export default DragArea;
