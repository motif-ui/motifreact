import styles from "../ImageUpload.module.scss";
import { MotifIcon } from "@/components/Motif/Icon";
import { useContext } from "react";
import { useUploadDragDrop } from "@/components/Upload/hooks/useUploadDragDrop";
import { MESSAGE, STATUS } from "@/components/Upload/constants";
import { UploadContext } from "@/components/Upload/UploadProvider";
import { Image } from "@/components/Upload/ImageUpload/components/Image";
import { capitalizeFirstLetter } from "../../../../../utils/utils";
import { sanitizeModuleClasses, sanitizeModuleRootClasses } from "../../../../../utils/cssUtils";
import { PropsWithRef } from "../../../../types";
import { FileType } from "@/components/Upload/types";

const ImageDragArea = (props: PropsWithRef<unknown, HTMLDivElement>) => {
  const { ref, style, className } = props;
  const {
    selectedFiles,
    size,
    uploadProps: { maxSize },
    addNewFiles,
    browse,
  } = useContext(UploadContext);
  const selectedImage = selectedFiles[0] as FileType | undefined;
  const status = selectedImage?.status;
  const disabled = selectedImage?.uploaded || status === STATUS.CHECK_FAIL;

  const { handleDragOver, handleDragLeave, hovered, handleDrop } = useUploadDragDrop({
    disabled,
    onNewFilesAdded: addNewFiles,
  });

  const errorMessage =
    selectedImage &&
    capitalizeFirstLetter(
      status === STATUS.CHECK_FAIL
        ? selectedImage.messages?.[0] || MESSAGE.MAX_SIZE_ERROR(selectedImage.file.size, maxSize!, selectedImage.file.name)
        : status === STATUS.DELETE_FAIL
          ? MESSAGE.DELETE_ERROR
          : MESSAGE.UPLOAD_ERROR,
    );
  const failed = status === STATUS.CHECK_FAIL || status === STATUS.UPLOAD_FAIL || status === STATUS.DELETE_FAIL;
  const maybeShowThumbnail = status !== undefined;
  const innerClasses = sanitizeModuleClasses(
    styles,
    "dragArea",
    hovered && "onDrag",
    failed && "error",
    !maybeShowThumbnail && "dragReady",
  );
  const mainClasses = sanitizeModuleRootClasses(styles, className, [size]);

  return (
    <div ref={ref} style={style} className={mainClasses}>
      <div
        className={innerClasses}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        {...(!disabled && !failed && { onClick: browse })}
      >
        {selectedImage && maybeShowThumbnail ? (
          <Image file={selectedImage} />
        ) : (
          <>
            <MotifIcon name="add" variant="secondary" className={styles.addIcon} />
            <span className={styles.dragMessage}>Choose or drag an image</span>
          </>
        )}
      </div>
      {failed && <span className={styles.errorMessage}>{errorMessage}</span>}
    </div>
  );
};

export default ImageDragArea;
