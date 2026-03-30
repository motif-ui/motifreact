import styles from "../UploadDragger.module.scss";
import { MotifIcon } from "@/components/Motif/Icon";
import { useContext, useEffect, useMemo, useRef } from "react";
import { useUploadDragDrop } from "@/components/Upload/hooks/useUploadDragDrop";
import { MESSAGE, STATUS } from "@/components/Upload/constants";
import { capitalizeFirstLetter } from "../../../../../utils/utils";
import { UploadContext } from "@/components/Upload/UploadProvider";
import { sanitizeModuleClasses } from "../../../../../utils/cssUtils";
import useDeepCompareEffect from "use-deep-compare-effect";
import { InputValue } from "../../../Form/types";

type Props = {
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  onChange?: (value?: InputValue) => void;
  onError?: (errors: string[]) => void;
};

const DragArea = (props: Props) => {
  const { disabled, error, success, onChange, onError } = props;
  const {
    selectedFiles,
    uploadProps: { maxSize, maxFile },
    addNewFiles,
    browse,
  } = useContext(UploadContext);

  const isFirstRun = useRef(true);

  const isMaxFileReached = selectedFiles.filter(file => file.status === STATUS.UPLOADING || file.uploaded).length >= maxFile;

  const isDisabled = disabled || isMaxFileReached;

  const { handleDragOver, handleDragLeave, hovered, handleDrop } = useUploadDragDrop({
    disabled: isDisabled,
    onNewFilesAdded: addNewFiles,
  });

  const classes = sanitizeModuleClasses(
    styles,
    "dragArea",
    hovered && "onDrag",
    !!selectedFiles.length && "flatBottom",
    isDisabled && "disabled",
    error ? "error" : success && "success",
  );

  const infoMessage = capitalizeFirstLetter(
    (maxSize ? MESSAGE.DRAGGER_MAX_SIZE(maxSize) + " " : "") +
      MESSAGE.DRAGGER_MAX_FILE(maxFile <= 0 ? 0 : maxFile) +
      MESSAGE.DRAGGER_CAN_UPLOAD_FILES,
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
    <div
      className={classes}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      {...(!isDisabled && { onClick: browse })}
    >
      <MotifIcon name="upload_file" variant="secondary" className={styles.dragIcon} />
      <span className={styles.dragText}>{MESSAGE.PLEASE_CLICK_OR_DROP}</span>
      <span className={styles.dragInfo}>{infoMessage}</span>
    </div>
  );
};

export default DragArea;
