import { FileObject, FileType } from "@/components/Upload/types.ts";
import { STATUS } from "@/components/Upload/constants.ts";
import { InputValue } from "@/components/Form/types.ts";

export const mapExternalValue = (value?: InputValue) =>
  value
    ? (value as FileObject[])
        .filter(f => f.src)
        .map(f => ({
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

export const normalizeValue = (value?: InputValue) =>
  value && Array.isArray(value)
    ? (value as (FileType | FileObject)[]).map(f => {
        if ("file" in f) return f;
        const fileObj = f;
        return {
          id: fileObj.id,
          file: {
            name: fileObj.name,
            type: fileObj.type,
            size: fileObj.size,
          },
          status: STATUS.SUCCESS,
          uploaded: true,
          download: fileObj.onDownloadClick,
          addedByValue: true,
          src: fileObj.src,
        };
      })
    : [];

/**
 * It is used to strip out some internal props out of the type which is sent to the form submit value.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const toFormValue = (files: FileType[]) => files.map(({ download: _d, addedByValue: _a, request: _r, ...rest }) => rest);
