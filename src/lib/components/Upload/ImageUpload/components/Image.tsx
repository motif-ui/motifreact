import styles from "../ImageUpload.module.scss";
import { STATUS } from "@/components/Upload/constants";
import { useContext } from "react";
import { UploadContext } from "@/components/Upload/UploadProvider";
import MotifIcon from "@/components/Motif/Icon/MotifIcon";
import { shortenText } from "src/utils/utils.ts";
import { MotifIconButton } from "@/components/Motif/Icon";
import Preview from "@/components/Upload/ImageUpload/components/Preview";
import useToggle from "../../../../hooks/useToggle";
import ProgressBar from "@/components/ProgressBar";

import { FileType } from "@/components/Upload/types";

type Props = {
  file: FileType;
};

export const Image = ({ file: { status, progress, file, src, addedByValue } }: Props) => {
  const { selectedFiles, removeFiles } = useContext(UploadContext);
  const image = src || (file instanceof File ? URL.createObjectURL(file) : undefined);
  const { visible, show, hide } = useToggle(false);
  const failed = status === STATUS.CHECK_FAIL || status === STATUS.UPLOAD_FAIL || (addedByValue && !src);
  const deleteFailed = status === STATUS.DELETE_FAIL;
  const succeeded = !failed && !deleteFailed && status !== STATUS.UPLOADING;

  const deleteIcon = (
    <MotifIconButton name="delete" variant="danger" className={styles.icon} onClick={() => removeFiles([selectedFiles[0]])} />
  );

  return (
    <>
      {status === STATUS.UPLOADING && (
        <div className={styles.progress}>
          <span>Uploading</span>
          <ProgressBar progress={progress} variant="primary" />
        </div>
      )}
      {(succeeded || deleteFailed) && (
        <div className={styles.fileItem}>
          <div className={styles.content}>
            <img src={image} alt="Image Thumbnail" />
          </div>
          {!visible && (
            <div className={styles.iconContainer}>
              <MotifIconButton className={styles.icon} variant="primary" name="visibility" onClick={show} />
              {deleteIcon}
            </div>
          )}
        </div>
      )}
      {failed && (
        <div className={styles.fileItem}>
          <div className={styles.content}>
            <MotifIcon variant="danger" name="imagesmode" size="xxl" />
            <span>{shortenText(file.name, 15)}</span>
          </div>
          <div className={styles.iconContainer}>{deleteIcon}</div>
        </div>
      )}
      {visible && image && <Preview image={image} onClose={hide} />}
    </>
  );
};
