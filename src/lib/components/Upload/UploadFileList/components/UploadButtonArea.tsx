import styles from "../FileList.module.scss";
import Button from "@/components/Button";
import { STATUS } from "@/components/Upload/constants";
import { useContext } from "react";
import { UploadContext } from "@/components/Upload/UploadProvider";

export const UploadButtonArea = () => {
  const {
    selectedFiles,
    uploadV2,
    uploadProps: { autoUpload },
    size,
  } = useContext(UploadContext);

  const ready = selectedFiles.some(f => f.status === STATUS.IDLE);

  return (
    !autoUpload && (
      <div className={styles.uploadButtonArea}>
        <Button onClick={() => uploadV2(selectedFiles, true)} disabled={!ready} size={size} label="Yükle" variant="success" shape="solid" />
      </div>
    )
  );
};
