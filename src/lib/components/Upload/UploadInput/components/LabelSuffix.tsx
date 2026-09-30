import { memo, useContext } from "react";
import styles from "../UploadInput.module.scss";
import { MotifIcon, MotifIconButton } from "@/components/Motif/Icon";
import IconButton from "@/components/IconButton";
import Tooltip from "@/components/Tooltip";
import { InputSize } from "../../../Form/types";
import { UploadContext } from "@/components/Upload/UploadProvider";
import { IconGlobalType } from "../../../../types";

type Props = {
  size: InputSize;
  errors?: string[];
  labelSuffix: LabelSuffix;
  enableDelete: boolean;
  enableDownload: boolean;
  actionIcon?: IconGlobalType;
};

export type LabelSuffix = "error" | "errorTooltip" | "success" | null;

export const LabelSuffix = memo((props: Props) => {
  const { size, errors, labelSuffix, enableDelete, enableDownload, actionIcon } = props;
  const { removeFiles, selectedFiles } = useContext(UploadContext);
  const isDeleting = selectedFiles.some(f => f.deleting);
  const downloadAll = () => selectedFiles.forEach(f => f.download?.());
  const actionAll = () => selectedFiles.forEach(f => f.action?.onClick());

  return (
    <div className={styles.labelSuffixWrapper} data-testid="labelSuffix">
      {enableDownload && <MotifIconButton onClick={downloadAll} name="download" size={size} />}
      {actionIcon && <IconButton onClick={actionAll} name={actionIcon} size={size} />}
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
