import styles from "../../FileList.module.scss";
import { MESSAGE, STATUS } from "@/components/Upload/constants";
import { memo } from "react";
import { useMotifContext } from "../../../../../motif/context/MotifProvider";
import { FileType } from "@/components/Upload/types";
import { formatBytes, shortenText } from "../../../../../../utils/utils";
import ProgressBar from "@/components/ProgressBar";
import { sanitizeModuleClasses } from "../../../../../../utils/cssUtils";
import { isFileFailed } from "@/components/Upload/helper";

type Props = {
  file: FileType;
};

export const FileLabel = memo(
  ({
    file: {
      status,
      messages,
      progress,
      addedByValue,
      file: { name, size },
    },
  }: Props) => {
    const failed = isFileFailed({ status });
    const successByUpload = status === STATUS.SUCCESS && !addedByValue;
    const helperClassName = sanitizeModuleClasses(styles, "helperText", failed ? "helperError" : successByUpload && "helperSuccess");
    const { t } = useMotifContext();

    return (
      <div className={styles.labelWrapper}>
        <span className={styles.label}>{shortenText(name, 30)}</span>
        <span className={helperClassName}>
          {status === STATUS.IDLE
            ? t(MESSAGE.WAITING_TO_UPLOAD)
            : successByUpload
              ? t(MESSAGE.UPLOAD_SUCCESS)
              : failed
                ? messages?.join("\n")
                : formatBytes(size)}
        </span>
        {status === STATUS.UPLOADING && (
          <div className={styles.progress}>
            <ProgressBar progress={progress} size="sm" variant="primary" />
          </div>
        )}
      </div>
    );
  },
);
