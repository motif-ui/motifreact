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
  enableDelete?: boolean;
};

export type LabelSuffix = "error" | "errorTooltip" | "success" | null;

export const LabelSuffix = memo((props: Props) => {
  const { size, errors, labelSuffix, enableDelete } = props;
  const { removeFiles, selectedFiles } = useContext(UploadContext);

  return (
    <div className={styles.labelSuffixWrapper}>
      {enableDelete && (
        <MotifIconButton
          onClick={() => removeFiles(selectedFiles)}
          name="delete"
          size={size}
          className={`${styles.labelSuffix} ${styles.focusable} ${styles.delete}`}
        />
      )}
      {labelSuffix === "errorTooltip" ? (
        <Tooltip text={errors?.join("\n\n") || ""} position="bottomRight" size={size}>
          <MotifIcon name="error" size={size} variant="danger" className={styles.labelSuffix} />
        </Tooltip>
      ) : labelSuffix === "error" ? (
        <MotifIcon name="error" size={size} variant="danger" className={styles.labelSuffix} />
      ) : labelSuffix === "success" ? (
        <MotifIcon name="check_circle" size={size} variant="success" className={styles.labelSuffix} />
      ) : null}
    </div>
  );
});
