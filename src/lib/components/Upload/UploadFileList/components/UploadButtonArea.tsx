import styles from "../FileList.module.scss";
import Button from "@/components/Button";
import { STATUS } from "@/components/Upload/constants";
import { useContext } from "react";
import { UploadContext } from "@/components/Upload/UploadProvider";
import { useMotifContext } from "../../../../motif/context/MotifProvider";

export const UploadButtonArea = () => {
  const {
    selectedFiles,
    uploadV2,
    uploadProps: { autoUpload },
    size,
  } = useContext(UploadContext);
  const { t } = useMotifContext();

  const ready = selectedFiles.some(f => f.status === STATUS.IDLE);

  return (
    !autoUpload && (
      <div className={styles.uploadButtonArea}>
        <Button
          onClick={() => uploadV2(selectedFiles, true)}
          disabled={!ready}
          size={size}
          label={t("g.upload")}
          variant="success"
          shape="solid"
        />
      </div>
    )
  );
};
