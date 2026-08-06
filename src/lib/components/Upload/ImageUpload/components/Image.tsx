import styles from "../ImageUpload.module.scss";
import { STATUS } from "@/components/Upload/constants";
import { useContext, useEffect, useState, MouseEvent } from "react";
import { UploadContext } from "@/components/Upload/UploadProvider";
import MotifIcon from "@/components/Motif/Icon/MotifIcon";
import { shortenText } from "src/utils/utils.ts";
import { MotifIconButton } from "@/components/Motif/Icon";
import Preview from "@/components/Upload/ImageUpload/components/Preview";
import useToggle from "../../../../hooks/useToggle";
import ProgressBar from "@/components/ProgressBar";
import { FileType } from "@/components/Upload/types";
import { BROKEN_IMG_SRC } from "src/lib/constants";

type Props = {
  file: FileType;
};

export const Image = ({ file: { status, progress, file, src, deleting, addedByValue } }: Props) => {
  const { selectedFiles, removeFiles } = useContext(UploadContext);
  const [image, setImage] = useState<string>();
  const [maybeBrokenSrc, setMaybeBrokenSrc] = useState(false);
  const { visible, show, hide } = useToggle(false);
  const failed = status === STATUS.CHECK_FAIL || status === STATUS.UPLOAD_FAIL;
  const deleteFailed = status === STATUS.DELETE_FAIL;
  const succeeded = !failed && !deleteFailed && status !== STATUS.UPLOADING;

  useEffect(() => {
    const image = addedByValue ? src : file instanceof File ? URL.createObjectURL(file) : undefined;
    image ? setImage(image) : setMaybeBrokenSrc(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    removeFiles([selectedFiles[0]]);
  };

  const deleteIcon = <MotifIconButton name="delete" variant="danger" className={styles.icon} disabled={deleting} onClick={handleDelete} />;
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
            {maybeBrokenSrc ? (
              <img src={BROKEN_IMG_SRC} alt="Broken Image" />
            ) : (
              image && <img src={image} alt="Image Thumbnail" onError={() => setMaybeBrokenSrc(true)} />
            )}
          </div>
          <div className={styles.iconContainer}>
            {!visible && !maybeBrokenSrc && <MotifIconButton className={styles.icon} variant="primary" name="visibility" onClick={show} />}
            {deleteIcon}
          </div>
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
