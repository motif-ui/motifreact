import { FileObject, FileType, FileValue } from "@/components/Upload/types.ts";
import { STATUS } from "@/components/Upload/constants.ts";
import { InputValue } from "@/components/Form/types.ts";

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
