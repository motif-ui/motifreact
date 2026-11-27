import styles from "@/components/Upload/UploadInput/UploadInput.module.scss";
import { MotifIcon, MotifIconButton } from "@/components/Motif/Icon";
import Tooltip from "@/components/Tooltip";
import { useMotifContext } from "../../../../motif/context/MotifProvider";
import { sanitizeModuleClasses } from "../../../../../utils/cssUtils";
import { InputSize } from "../../../Form/types";
import { FileType } from "@/components/Upload/types";

type Props = {
  files: FileType[];
  disabled?: boolean;
  size: InputSize;
  errors: string[];
  error?: boolean;
  success?: boolean;
  readOnly?: boolean;
  onBrowse: () => void;
  onClear: () => void;
};

export const LabelArea = (props: Props) => {
  const { files, errors, size, disabled, readOnly, error, success, onBrowse, onClear } = props;
  const { t } = useMotifContext();

  const noFiles = !files.length;
  const text = noFiles
    ? t("upload.selectFile")
    : files.length === 1
      ? files[0].file.name
      : t("upload.filesSelected", { count: files.length });
  const enableDelete = !disabled && !readOnly && !noFiles;

  const wrapperClassNames = sanitizeModuleClasses(
    styles,
    "labelArea",
    disabled ? "disabled" : error || errors.length ? "error" : success && "success",
  );
  const classNames = sanitizeModuleClasses(styles, "label", noFiles && "placeholder", disabled ? "disabled" : readOnly && "readOnly");

  return (
    <div className={wrapperClassNames}>
      <button className={classNames} onClick={onBrowse} disabled={disabled || readOnly} type="button">
        {text}
      </button>
      {(enableDelete || error || success || !!errors.length) && (
        <div className={styles.labelSuffixWrapper}>
          {enableDelete && <MotifIconButton onClick={onClear} name="delete" size={size} />}
          {errors.length ? (
            <Tooltip text={errors.join("\n\n")} position="bottomRight" size={size}>
              <MotifIcon name="error" size={size} variant="danger" />
            </Tooltip>
          ) : error ? (
            <MotifIcon name="error" size={size} variant="danger" />
          ) : (
            success && <MotifIcon name="check_circle" size={size} variant="success" />
          )}
        </div>
      )}
    </div>
  );
};
