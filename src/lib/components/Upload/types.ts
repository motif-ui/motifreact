import { HttpMethods, KeyValue, Size4SM } from "../../types";
import { ReactNode } from "react";

export type FileType = {
  id: string;
  file: File;
  status: number;
  uploaded?: boolean;
  progress?: number;
  messages?: string[];
  request?: XMLHttpRequest;
};

export type RequestSettings = {
  url: string;
  method: HttpMethods;
  headers?: KeyValue[];
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
