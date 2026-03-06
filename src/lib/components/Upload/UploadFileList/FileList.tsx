"use client";
import styles from "./FileList.module.scss";
import { FileListRow } from "@/components/Upload/UploadFileList/components/Row/FileListRow";
import { UploadButtonArea } from "@/components/Upload/UploadFileList/components/UploadButtonArea";
import { useContext } from "react";
import { UploadContext } from "@/components/Upload/UploadProvider";
import { sanitizeModuleRootClasses } from "../../../../utils/cssUtils";

type Props = {
  disabled?: boolean;
};

const FileList = ({ disabled }: Props) => {
  const { selectedFiles, size } = useContext(UploadContext);

  const classes = sanitizeModuleRootClasses(styles, undefined, [size]);

  return (
    !!selectedFiles.length && (
      <div className={classes}>
        <div className={styles.files} data-testid="uploadFileList">
          {selectedFiles.map(file => (
            <FileListRow file={file} disabled={disabled} key={file.id} />
          ))}
        </div>
        {!disabled && <UploadButtonArea />}
      </div>
    )
  );
};

export default FileList;
