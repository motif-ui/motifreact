import { FileObject, FileType, FileValue, UploadProps } from "@/components/Upload/types.ts";
import { MESSAGE, MIME_TYPES, STATUS } from "@/components/Upload/constants.ts";
import { InputValue } from "@/components/Form/types.ts";
import { LibraryTranslateFn } from "../../../i18n/types";
import { formatBytes, shortenText } from "../../../utils/utils";

export const mapExternalValue = (value?: InputValue) =>
  value
    ? (value as FileObject[]).map(f => ({
        id: f.id,
        file: {
          name: f.name,
          type: f.type,
          size: f.size,
        },
        status: STATUS.SUCCESS,
        uploaded: true,
        download: f.onDownloadClick,
        addedByValue: true,
        src: f.src,
      }))
    : [];

/**
 * It is used to strip out some internal props out of the type which is sent to the form submit value.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const toFileValue = ({ download: _d, addedByValue: _a, request: _r, ...rest }: FileType): FileValue => rest;

export const toFormValue = (files: FileType[]) => files.map(toFileValue);

/**
 * Whether the file is on the server, so download/action buttons can be shown.
 */
export const isFileOnServer = (f: FileType) => f.status === STATUS.SUCCESS || f.status === STATUS.DELETE_FAIL;

/**
 * Whether the file is on the server and not being deleted, so download/action buttons can be used.
 */
export const isFileReady = (f: FileType) => !f.deleting && isFileOnServer(f);

/**
 * Whether the file failed validation, upload or delete.
 */
export const isFileFailed = (f: Pick<FileType, "status">) =>
  f.status === STATUS.CHECK_FAIL || f.status === STATUS.UPLOAD_FAIL || f.status === STATUS.DELETE_FAIL;

/**
 * Returns the validation errors of a file: size, mime type, max file count and custom validation.
 * `validFileCount` is the number of files before it that passed, for the max file check.
 */
export const getFileErrors = (
  file: FileType["file"],
  validFileCount: number,
  rules: Pick<UploadProps, "accept" | "maxFile" | "maxSize" | "messages" | "customValidation">,
  t: LibraryTranslateFn,
) => {
  const { maxSize, accept, maxFile, messages, customValidation } = rules;

  const maxSizeError =
    maxSize &&
    file.size > maxSize &&
    (messages?.maxSizeMessage ??
      t(MESSAGE.MAX_SIZE_ERROR, {
        maxSize: formatBytes(maxSize),
        fileName: shortenText(file.name, 30),
        fileSize: formatBytes(file.size),
      }));

  // Mime Type Check
  const mimeTypeMessage =
    accept &&
    !accept.includes(MIME_TYPES.ALL) &&
    !accept.includes(file.type) &&
    (messages?.mimeTypeMessage ?? t(MESSAGE.MIME_TYPE, { acceptType: accept.toString(), fileType: file.type }));

  // Max File Check
  const maxFileError =
    maxFile && validFileCount >= maxFile && (messages?.maxFileMessage ?? t(MESSAGE.MAX_FILE, { maxFile, count: maxFile }));

  // Custom Validation
  const { errorMessage: customValidationError, isValid: customValidationValid } = customValidation?.(file as File) || {};
  const customValidationMessage = customValidationValid === false ? customValidationError || t(MESSAGE.CUSTOM_VALIDATION_ERROR) : undefined;

  return [maxSizeError, maxFileError, mimeTypeMessage, customValidationMessage].filter(Boolean) as string[];
};
