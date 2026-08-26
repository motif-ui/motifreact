import { memo, useContext } from "react";
import styles from "../UploadInput.module.scss";
import { MotifIcon, MotifIconButton } from "@/components/Motif/Icon";
import Tooltip from "@/components/Tooltip";
import { InputSize } from "../../../Form/types";
import { UploadContext } from "@/components/Upload/UploadProvider";

type Props = {
  size: InputSize;
  errors?: string[];
  labelSuffix: LabelSuffix;
  enableDelete: boolean;
  enableDownload: boolean;
};

export type LabelSuffix = "error" | "errorTooltip" | "success" | null;

export const LabelSuffix = memo((props: Props) => {
  const { size, errors, labelSuffix, enableDelete, enableDownload } = props;
  const { removeFiles, selectedFiles } = useContext(UploadContext);
  const isDeleting = selectedFiles.some(f => f.deleting);
  const downloadAll = () => selectedFiles.forEach(f => f.download?.());

  return (
    <div className={styles.labelSuffixWrapper}>
      {enableDownload && <MotifIconButton onClick={downloadAll} name="download" size={size} />}
      {enableDelete && <MotifIconButton onClick={() => removeFiles(selectedFiles)} name="delete" size={size} disabled={isDeleting} />}
      {labelSuffix === "errorTooltip" ? (
        <Tooltip text={errors?.join("\n\n") || ""} position="bottomRight" size={size}>
          <MotifIcon name="error" size={size} variant="danger" />
        </Tooltip>
      ) : labelSuffix === "error" ? (
        <MotifIcon name="error" size={size} variant="danger" />
      ) : labelSuffix === "success" ? (
        <MotifIcon name="check_circle" size={size} variant="success" />
      ) : null}
    </div>
  );
});
