import styles from "../../FileList.module.scss";
import { STATUS } from "@/components/Upload/constants";
import { MotifIconButton } from "@/components/Motif/Icon";
import { memo, useContext } from "react";
import { FileType } from "@/components/Upload/types";
import { UploadContext } from "@/components/Upload/UploadProvider";

type Props = {
  file: FileType;
};

export const FileButton = memo(({ file }: Props) => {
  const { removeFiles, reUpload, abort, size } = useContext(UploadContext);
  const iconSize = size === "sm" ? "xs" : size === "lg" ? "md" : "sm";

  return (
    <>
      {(file.status === STATUS.UPLOAD_FAIL || file.status === STATUS.ABORT) && (
        <MotifIconButton
          name="autorenew"
          variant="secondary"
          size={iconSize}
          className={`${styles.icon} ${styles.iconRenew}`}
          onClick={() => reUpload(file)}
        />
      )}
      {file.status === STATUS.UPLOADING ? (
        <MotifIconButton name="cancel_outline" variant="secondary" size={iconSize} className={styles.icon} onClick={() => abort(file)} />
      ) : (
        <MotifIconButton
          name="delete"
          variant="secondary"
          size={iconSize}
          className={`${styles.icon} ${styles.iconDelete}`}
          onClick={() => removeFiles([file])}
        />
      )}
    </>
  );
});
