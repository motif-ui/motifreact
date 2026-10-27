import { memo, useContext } from "react";
import styles from "../UploadInput.module.scss";
import { MotifIcon, MotifIconButton } from "@/components/Motif/Icon";
import IconButton from "@/components/IconButton";
import Tooltip from "@/components/Tooltip";
import { InputSize } from "../../../Form/types";
import { UploadContext } from "@/components/Upload/UploadProvider";
import { isFileReady, toFileValue } from "@/components/Upload/helper";

type Props = {
  size: InputSize;
  errors?: string[];
  labelSuffix: LabelSuffix;
  enableDelete: boolean;
  enableDownload: boolean;
  enableAction: boolean;
};

export type LabelSuffix = "error" | "errorTooltip" | "success" | null;

export const LabelSuffix = memo((props: Props) => {
  const { size, errors, labelSuffix, enableDelete, enableDownload, enableAction } = props;
  const {
    removeFiles,
    selectedFiles,
    uploadProps: { fileAction },
  } = useContext(UploadContext);
  const isDeleting = selectedFiles.some(f => f.deleting);
  const readyDownloadFiles = selectedFiles.filter(f => !!f.download && isFileReady(f));
  const readyActionFiles = selectedFiles.filter(isFileReady);
  const downloadAll = () => readyDownloadFiles.forEach(f => f.download?.());
  const actionAll = () => readyActionFiles.forEach(f => fileAction?.onClick(toFileValue(f)));

  return (
    <div className={styles.labelSuffixWrapper} data-testid="labelSuffix">
      {enableDownload && <MotifIconButton onClick={downloadAll} name="download" size={size} disabled={!readyDownloadFiles.length} />}
      {enableAction && <IconButton onClick={actionAll} name={fileAction?.icon} size={size} disabled={!readyActionFiles.length} />}
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
