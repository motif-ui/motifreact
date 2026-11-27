import styles from "../../FileList.module.scss";
import { STATUS } from "@/components/Upload/constants";
import { MotifIconButton } from "@/components/Motif/Icon";
import { memo, useContext } from "react";
import { FileType } from "@/components/Upload/types";
import { UploadContext } from "@/components/Upload/UploadProvider";
import IconButton from "@/components/IconButton";
import { isFileOnServer, isFileReady, toFileValue } from "@/components/Upload/helper";

type Props = {
  file: FileType;
  readOnly?: boolean;
  disabled?: boolean;
};

export const FileButton = memo(({ file, readOnly, disabled }: Props) => {
  const {
    removeFiles,
    reUpload,
    abort,
    size,
    uploadProps: { fileAction },
  } = useContext(UploadContext);

  return (
    <>
      {fileAction && isFileOnServer(file) && (
        <IconButton
          name={fileAction.icon}
          variant="neutral"
          size={size}
          className={`${styles.icon} ${styles.iconPositiveAction}`}
          onClick={() => fileAction.onClick(toFileValue(file))}
          disabled={!isFileReady(file)}
        />
      )}
      {file.download && isFileOnServer(file) && (
        <MotifIconButton
          name="download"
          variant="neutral"
          size={size}
          className={`${styles.icon} ${styles.iconPositiveAction}`}
          onClick={file.download}
          disabled={!isFileReady(file)}
        />
      )}
      {!disabled && !readOnly && (
        <>
          {(file.status === STATUS.UPLOAD_FAIL || file.status === STATUS.ABORT) && (
            <IconButton
              name="autorenew"
              variant="neutral"
              size={size}
              className={`${styles.icon} ${styles.iconPositiveAction}`}
              onClick={() => reUpload(file)}
            />
          )}
          {file.status === STATUS.UPLOADING ? (
            <IconButton name="cancel_outline" variant="neutral" size={size} className={styles.icon} onClick={() => abort(file)} />
          ) : (
            <IconButton
              name="delete"
              variant="neutral"
              size={size}
              className={`${styles.icon} ${styles.iconDelete}`}
              disabled={file.deleting}
              onClick={() => removeFiles([file])}
            />
          )}
        </>
      )}
    </>
  );
});
