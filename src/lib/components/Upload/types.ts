import { HttpMethods, KeyValue, Size4SM } from "../../types";
import { ReactNode } from "react";

export type FileType = {
  id: string;
  file: Pick<File, "name" | "size" | "type">;
  status: number;
  uploaded?: boolean;
  progress?: number;
  messages?: string[];
  request?: XMLHttpRequest;
  download?: () => void;
  addedByValue?: boolean;
};

/**
 * This type is used to get already uploaded files on the server from the user
 */
export type FileObject = {
  id: string;
  onDownloadClick?: () => void;
} & Pick<File, "name" | "size" | "type">;

export type RequestSettings = {
  url: string;
  method: HttpMethods;
  headers?: KeyValue[];
  /**
   * ```
   * in milliseconds, uploadRequest only
   * ```
   * Aborts the upload if no upload-progress event arrives for this long while data is still
   * being sent — this is what detects a stalled/hung connection. Resets on every progress tick;
   * stops applying once the upload phase completes (from then on we're just waiting on the
   * server's response). Falls back to DEFAULT_UPLOAD_STALL_TIMEOUT_MS.
   */
  stallTimeout?: number;
};

export type UploadMessages = {
  maxFileMessage?: string;
  maxSizeMessage?: string;
  fileExistsMessage?: string;
  mimeTypeMessage?: string;
  uploadFailMessage?: string;
};

export type UploadProps = {
  uploadRequest: RequestSettings;
  deleteRequest: RequestSettings;
  accept?: Array<string>;
  maxFile?: number; // Maximum allowed files
  /**
   * ```
   * in bytes
   * ```
   */
  onError?: (errors: string[]) => void;
  customValidation?: (file: File) => CustomValidation;
} & UploadDefaultableProps;

export type UploadDefaultableProps = {
  autoUpload?: boolean;
  messages?: UploadMessages;
  maxSize?: number; // Maximum allowed size in Bytes per file
};

export type UploadPropsDefault = {
  uploadRequest: RequestSettings;
  deleteRequest: RequestSettings;
  accept?: Array<string>;
  maxFile: number;
  maxSize?: number;
  autoUpload: boolean;
  messages?: UploadMessages;
};

export type UploadContextType = {
  uploadProps: UploadPropsDefault;
  selectedFiles: FileType[];
  size: Size4SM;
  browse: () => void;
  uploadV2: (allFiles: FileType[], bulk?: boolean) => void;
  removeFiles: (filesToRemove: FileType[]) => void;
  addNewFiles: (files: FileList | null) => void;
  abort: (file: FileType) => void;
  reUpload: (file: FileType) => void;
};

export type UploadProviderProps = {
  disabled?: boolean;
  children: ReactNode;
  props: UploadProps;
  isUploadInput?: boolean;
  size?: Size4SM;
  name?: string;
  value?: FileType[];
};

export type InputState = "noFile" | "waitingToUpload" | "uploading" | "error" | "uploaded";

export const ContextDefaultValues: UploadContextType = {
  uploadProps: {
    uploadRequest: { url: "", method: "GET" },
    deleteRequest: { url: "", method: "GET" },
    autoUpload: true,
    maxFile: 1,
  },
  selectedFiles: [],
  size: "md",
  browse: () => {},
  uploadV2: () => {},
  removeFiles: () => {},
  abort: () => {},
  reUpload: () => {},
  addNewFiles: () => {},
};

type CustomValidation = { isValid: boolean; errorMessage?: string };
