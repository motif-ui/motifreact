import styles from "../UploadInput.module.scss";
import { InputState } from "@/components/Upload/types";
import { STATUS } from "@/components/Upload/constants";
import { LabelSuffix } from "@/components/Upload/UploadInput/components/LabelSuffix";
import { useContext } from "react";
import { useMotifContext } from "../../../../motif/context/MotifProvider";
import { InputSize } from "../../../Form/types";
import { UploadContext } from "@/components/Upload/UploadProvider";
import ProgressBar from "@/components/ProgressBar";
import { sanitizeModuleClasses } from "../../../../../utils/cssUtils";

type Props = {
  disabled?: boolean;
  size: InputSize;
  inputState: InputState;
  errors?: string[];
  error?: boolean;
  success?: boolean;
};

export const LabelArea = (props: Props) => {
  const { disabled, success, error, errors, size, inputState } = props;
  const {
    selectedFiles,
    uploadProps: { autoUpload },
    browse,
  } = useContext(UploadContext);
  const { t } = useMotifContext();

  const progress = selectedFiles.filter(f => f.status === STATUS.UPLOADING)[0]?.progress || 0;
  const uploading = selectedFiles.some(f => f.status === STATUS.UPLOADING);
  const noFiles = !selectedFiles.length;
  const text = noFiles
    ? t("upload.selectFile")
    : selectedFiles.length === 1
      ? selectedFiles[0]?.file.name
      : selectedFiles.length && selectedFiles.every(f => f.status === STATUS.SUCCESS)
        ? t("upload.filesUploaded", { count: selectedFiles.length })
        : t("upload.filesSelected", { count: selectedFiles.length });

  const aboutToUpload = autoUpload && !!selectedFiles.length && selectedFiles.every(f => f.status === STATUS.IDLE);

  const suffixType: LabelSuffix = errors?.length ? "errorTooltip" : error ? "error" : success ? "success" : null;
  const enableDelete = !!errors?.length || (inputState !== "noFile" && inputState !== "uploading");
  const buttonDisabled = disabled || (inputState !== "noFile" && inputState !== "uploading");
  const numberOfSuffixes = (suffixType ? 1 : 0) + (enableDelete ? 1 : 0);

  const wrapperClassNames = sanitizeModuleClasses(
    styles,
    "labelArea",
    "focusable",
    disabled ? "disabled" : error || errors?.length ? "error" : success && "success",
  );

  const classNames = sanitizeModuleClasses(
    styles,
    "label",
    noFiles && "placeholder",
    (autoUpload || noFiles) && "roundedEnd",
    numberOfSuffixes === 1 ? "hasSuffix" : numberOfSuffixes === 2 && "hasSuffixes",
  );
  return (
    <div className={wrapperClassNames}>
      {aboutToUpload || uploading ? (
        <ProgressBar progress={progress} size="sm" variant="primary" className={styles.progress} />
      ) : (
        <>
          <button className={classNames} onClick={browse} disabled={buttonDisabled} type="button">
            {text}
          </button>
          <LabelSuffix size={size} errors={errors} labelSuffix={suffixType} enableDelete={enableDelete} />
        </>
      )}
    </div>
  );
};
