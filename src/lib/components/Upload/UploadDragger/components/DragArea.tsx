import styles from "../UploadDragger.module.scss";
import { MotifIcon } from "@/components/Motif/Icon";
import { useContext } from "react";
import { useUploadDragDrop } from "@/components/Upload/hooks/useUploadDragDrop";
import { MESSAGE, STATUS } from "@/components/Upload/constants";
import { capitalizeFirstLetter } from "../../../../../utils/utils";
import { UploadContext } from "@/components/Upload/UploadProvider";
import { sanitizeModuleClasses } from "../../../../../utils/cssUtils";

const DragArea = () => {
  const {
    selectedFiles,
    uploadProps: { maxSize, maxFile },
    addNewFiles,
    browse,
  } = useContext(UploadContext);

  const disabled =
    (maxFile === 1 && selectedFiles[0]?.uploaded) ||
    (typeof maxFile !== "undefined" && selectedFiles.filter(file => file.status === STATUS.UPLOADING || file.uploaded).length >= maxFile);

  const { handleDragOver, handleDragLeave, hovered, handleDrop } = useUploadDragDrop({ disabled, onNewFilesAdded: addNewFiles });

  const classes = sanitizeModuleClasses(styles, "dragArea", hovered && "onDrag", !!selectedFiles.length && "flatBottom");
  const infoMessage = capitalizeFirstLetter(
    (maxSize ? MESSAGE.DRAGGER_MAX_SIZE(maxSize) + " " : "") +
      MESSAGE.DRAGGER_MAX_FILE(maxFile <= 0 ? 0 : maxFile) +
      MESSAGE.DRAGGER_CAN_UPLOAD_FILES,
  );

  return (
    <div
      className={classes}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      {...(!disabled && { onClick: browse })}
    >
      <MotifIcon name="upload_file" variant="secondary" className={styles.dragIcon} />
      <span className={styles.dragText}>{MESSAGE.PLEASE_CLICK_OR_DROP}</span>
      <span className={styles.dragInfo}>{infoMessage}</span>
    </div>
  );
};

export default DragArea;
