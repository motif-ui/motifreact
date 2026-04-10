import styles from "../../FileList.module.scss";
import { MotifIcon } from "@/components/Motif/Icon";
import { FileLabel } from "@/components/Upload/UploadFileList/components/Row/FileLabel";
import { FileButton } from "@/components/Upload/UploadFileList/components/Row/FileButton";
import { FileType } from "@/components/Upload/types";
import { memo, useContext } from "react";
import { UploadContext } from "@/components/Upload/UploadProvider";
import { sanitizeModuleClasses } from "../../../../../../utils/cssUtils";

type Props = {
  file: FileType;
  disabled?: boolean;
  readOnly?: boolean;
};

export const FileListRow = memo(({ file, disabled, readOnly }: Props) => {
  const { size } = useContext(UploadContext);
  const iconSize = size === "xs" ? "sm" : size === "sm" ? "md" : size === "lg" ? "xl" : "lg";

  const classes = sanitizeModuleClasses(styles, "fileRow", disabled && "disabled");

  return (
    <div className={classes}>
      <MotifIcon size={iconSize} name="attach_file" variant="secondary" className={styles.icon} />
      <FileLabel file={file} />
      {!disabled && !readOnly && <FileButton file={file} />}
    </div>
  );
});
