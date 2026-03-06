import styles from "../../FileList.module.scss";
import { MotifIcon } from "@/components/Motif/Icon";
import { FileLabel } from "@/components/Upload/UploadFileList/components/Row/FileLabel";
import { FileButton } from "@/components/Upload/UploadFileList/components/Row/FileButton";
import { FileType } from "@/components/Upload/types";
import { memo, useContext } from "react";
import { UploadContext } from "@/components/Upload/UploadProvider";

type Props = {
  file: FileType;
  disabled?: boolean;
};

export const FileListRow = memo(({ file, disabled }: Props) => {
  const { size } = useContext(UploadContext);
  const iconSize = size === "sm" ? "md" : size === "lg" ? "xl" : "lg";

  return (
    <div className={styles.fileRow}>
      <MotifIcon size={iconSize} name="attach_file" variant="secondary" className={styles.icon} />
      <FileLabel file={file} />
      {!disabled && <FileButton file={file} />}
    </div>
  );
});
