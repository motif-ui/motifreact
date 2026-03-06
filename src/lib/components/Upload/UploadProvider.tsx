import { ContextDefaultValues, FileType, UploadContextType, UploadPropsDefault, UploadProviderProps } from "@/components/Upload/types";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { MESSAGE, MIME_TYPES, STATUS } from "@/components/Upload/constants";
import { formatBytes, generateUUIDV4 } from "../../../utils/utils";

export const UploadContext = createContext<UploadContextType>(ContextDefaultValues);

export const UploadProvider = ({ children, props, isUploadInput, size = "md", name, disabled }: UploadProviderProps) => {
  const { maxFile = 1, autoUpload = true, messages, uploadRequest, deleteRequest, maxSize, accept, customValidation } = props;
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileType[]>([]);

  const selectedFilesEqualityString = selectedFiles
    .map(f => f.id + f.file.name + f.file.size + f.file.type + f.status + (f.progress || 0) + (f.messages?.join("") || ""))
    .join(",");

  const _updateProgress = useCallback((fileIds: string[], e: ProgressEvent<XMLHttpRequestEventTarget>) => {
    const percentCompleted = Math.round((e.loaded / e.total) * 100);
    setSelectedFiles(prevState =>
      prevState.map(file =>
        !fileIds.includes(file.id)
          ? file
          : {
              ...file,
              status: STATUS.UPLOADING,
              progress: percentCompleted,
            },
      ),
    );
  }, []);

  const _transferComplete = useCallback(
    (fileIds: string[], request: XMLHttpRequest) => {
      setSelectedFiles(prevState => {
        const status = request.status === 200 ? STATUS.SUCCESS : STATUS.UPLOAD_FAIL;
        return prevState.map(file =>
          !fileIds.includes(file.id)
            ? file
            : {
                ...file,
                status,
                messages: status === STATUS.SUCCESS ? [] : [messages?.uploadFailMessage || MESSAGE.UPLOAD_ERROR],
                uploaded: status === STATUS.SUCCESS,
              },
        );
      });
    },
    [messages?.uploadFailMessage],
  );

  const _transferFailed = useCallback(
    (fileIds: string[]) => {
      setSelectedFiles(prevState =>
        prevState.map(file =>
          !fileIds.includes(file.id)
            ? file
            : {
                ...file,
                status: STATUS.UPLOAD_FAIL,
                messages: [messages?.uploadFailMessage || MESSAGE.UPLOAD_ERROR],
              },
        ),
      );
    },
    [messages?.uploadFailMessage],
  );

  const _transferAborted = useCallback(
    (fileIds: string[]) =>
      setSelectedFiles(prevState =>
        prevState.map(file =>
          !fileIds.includes(file.id)
            ? file
            : {
                ...file,
                status: STATUS.ABORT,
                progress: 0,
              },
        ),
      ),
    [],
  );

  const _prepareRequestAndSend = useCallback(
    (files: FileType[], bulk?: boolean) => {
      if (!files.length) return;
      const fileIds = files.map(file => file.id);

      if (!uploadRequest.url || !deleteRequest.url) {
        _transferFailed(fileIds);
        return;
      }

      const request = new XMLHttpRequest();
      request.addEventListener("load", () => _transferComplete(fileIds, request));
      request.addEventListener("error", () => _transferFailed(fileIds));
      request.addEventListener("abort", () => _transferAborted(fileIds));
      request.upload.addEventListener("progress", e => _updateProgress(fileIds, e));

      request.open(uploadRequest.method, uploadRequest.url);

      uploadRequest.headers?.forEach(item => {
        request.setRequestHeader(item.key, item.value);
      });

      const data = new FormData();
      if (bulk) {
        files.forEach(file => {
          data.append("file_" + file.id, file.file);
          data.append("fileId_" + file.id, file.id);
        });
      } else {
        data.append("file_" + files[0].id, files[0].file);
        data.append("fileId_" + files[0].id, files[0].id);
      }

      setSelectedFiles(prevState =>
        prevState.map(file => (!fileIds.includes(file.id) ? file : { ...file, status: STATUS.UPLOADING, request })),
      );

      request.send(data);
    },
    [
      _transferAborted,
      _transferComplete,
      _transferFailed,
      _updateProgress,
      deleteRequest.url,
      uploadRequest.headers,
      uploadRequest.method,
      uploadRequest.url,
    ],
  );

  const _deleteOnTheServerErrorHandler = useCallback((filesToDelete: FileType[]) => {
    setSelectedFiles(prevState =>
      prevState.map(file =>
        filesToDelete.some(f => f.id === file.id)
          ? {
              ...file,
              status: STATUS.DELETE_FAIL,
              messages: [MESSAGE.DELETE_ERROR],
            }
          : file,
      ),
    );
  }, []);

  const _deleteFilesFromServer = useCallback(
    (filesToDelete: FileType[]) => {
      const request = new XMLHttpRequest();
      request.addEventListener("load", () => {
        if (request.status === 200) {
          setSelectedFiles(prevState => prevState.filter(file => !filesToDelete.some(f => f.id === file.id)));
        } else {
          _deleteOnTheServerErrorHandler(filesToDelete);
        }
      });

      request.addEventListener("error", () => {
        _deleteOnTheServerErrorHandler(filesToDelete);
      });

      request.open(deleteRequest.method, deleteRequest.url);

      deleteRequest.headers?.forEach(item => {
        request.setRequestHeader(item.key, item.value);
      });

      const data = filesToDelete.length > 1 ? filesToDelete.map(file => file.id) : filesToDelete[0].id;
      request.send(JSON.stringify(data));
    },
    [deleteRequest.method, deleteRequest.url, deleteRequest.headers, _deleteOnTheServerErrorHandler],
  );

  const uploadV2 = useCallback(
    (allFiles: FileType[], bulk?: boolean) => {
      const readyFiles = allFiles.filter(c => c.status === STATUS.IDLE);
      if (bulk) {
        _prepareRequestAndSend(readyFiles, true);
      } else {
        readyFiles.forEach(file => {
          _prepareRequestAndSend([file]);
        });
      }
    },
    [_prepareRequestAndSend],
  );

  const addNewFiles = useCallback(
    (files: FileList | null) => {
      if (files?.length) {
        if (isUploadInput) {
          setSelectedFiles(Array.from(files).map(file => ({ file, id: generateUUIDV4(), status: STATUS.IDLE })));
        } else {
          const parsedFiles = Array.from(files).reduce((acc, file) => {
            const isSameFile = selectedFiles.some(selectedFile => _isSameFile(file, selectedFile));

            return isSameFile
              ? acc
              : [
                  ...acc,
                  {
                    file,
                    id: generateUUIDV4(),
                    status: STATUS.IDLE,
                  },
                ];
          }, [] as FileType[]);
          setSelectedFiles(prevState => (maxFile > 1 ? [...prevState, ...parsedFiles] : parsedFiles));
        }
      }
    },
    [isUploadInput, maxFile, selectedFiles],
  );

  // The effect that handles file changes and their states and reflects them to the UI
  useEffect(() => {
    let filesIteratedWithoutError = 0;
    const filesAfterVerification = selectedFiles.map(f => {
      // Uploading or uploaded files should not be checked again
      if (f.status === STATUS.UPLOADING || f.uploaded) {
        filesIteratedWithoutError++;
        return f;
      }

      const maxSizeError =
        maxSize &&
        f.file.size > maxSize &&
        (messages?.maxSizeMessage ?? MESSAGE.MAX_SIZE_ERROR(f.file.size, maxSize, f.file.name))
          .replaceAll("%maxSize%", maxSize.toString())
          .replaceAll("%fileSize%", formatBytes(f.file.size));

      // Mime Type Check
      const mimeTypeMessage =
        accept &&
        !accept.includes(MIME_TYPES.ALL) &&
        !accept.includes(f.file.type) &&
        (messages?.mimeTypeMessage ?? MESSAGE.MIME_TYPE)
          .replaceAll("%acceptType%", accept.toString())
          .replaceAll("%fileType%", f.file.type);

      // Max File Check
      const maxFileError =
        maxFile &&
        filesIteratedWithoutError >= maxFile &&
        (messages?.maxFileMessage ?? MESSAGE.MAX_FILE).replaceAll("%maxFile%", maxFile.toString());

      // Custom Validation
      const { errorMessage: customValidationError, isValid: customValidationValid } = customValidation?.(f.file) || {};
      const customValidationMessage =
        customValidationValid === false ? customValidationError || MESSAGE.CUSTOM_VALIDATION_ERROR : undefined;

      const errors = [maxSizeError, maxFileError, mimeTypeMessage, customValidationMessage].filter(Boolean) as string[];

      !errors.length && filesIteratedWithoutError++;
      return {
        ...f,
        ...(errors.length
          ? { status: STATUS.CHECK_FAIL, messages: errors }
          : { status: f.status === STATUS.CHECK_FAIL ? STATUS.IDLE : f.status }),
      };
    });

    setSelectedFiles(filesAfterVerification);

    if (autoUpload) {
      const hasError = filesAfterVerification.some(f => f.messages?.length);
      if (isUploadInput) {
        !hasError && uploadV2(filesAfterVerification, true);
      } else {
        uploadV2(filesAfterVerification);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accept, autoUpload, isUploadInput, maxFile, maxSize, messages, selectedFilesEqualityString, uploadV2]);

  const removeFiles = useCallback(
    (filesToRemove: FileType[]) => {
      const filesOnTheServer = filesToRemove.filter(f => f.uploaded);
      const filesOnTheClient = filesToRemove.filter(f => !f.uploaded);

      if (filesOnTheClient.length) {
        setSelectedFiles(files => files.filter(f => !filesToRemove.some(file => file.id === f.id)));
      }
      if (filesOnTheServer.length) {
        _deleteFilesFromServer(filesOnTheServer);
      }
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = "";
      }
    },
    [_deleteFilesFromServer],
  );

  const abort = useCallback((file: FileType) => file.request?.abort(), []);
  const browse = useCallback(() => hiddenInputRef.current?.click(), [hiddenInputRef]);
  const reUpload = useCallback((file: FileType) => _prepareRequestAndSend([file]), [_prepareRequestAndSend]);

  const uploadProps: UploadPropsDefault = {
    maxFile,
    autoUpload,
    accept,
    maxSize,
    messages,
    deleteRequest,
    uploadRequest,
  };

  return (
    <UploadContext
      value={{
        selectedFiles,
        uploadV2,
        removeFiles,
        uploadProps,
        browse,
        addNewFiles,
        abort,
        reUpload,
        size,
      }}
    >
      {children}
      <input
        name={name}
        ref={hiddenInputRef}
        type="file"
        hidden
        disabled={disabled}
        accept={(accept ?? [MIME_TYPES.ALL]).join(",")}
        multiple={maxFile > 1}
        onChange={e => addNewFiles(e.target.files)}
      />
    </UploadContext>
  );
};

const _isSameFile = (f1: File, f2: FileType) =>
  f1.name === f2.file.name && f1.size === f2.file.size && f1.lastModified === f2.file.lastModified && f1.type === f2.file.type;
