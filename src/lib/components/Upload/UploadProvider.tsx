import { ContextDefaultValues, FileType, UploadContextType, UploadPropsDefault, UploadProviderProps } from "@/components/Upload/types";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_UPLOAD_STALL_TIMEOUT_MS, MESSAGE, MIME_TYPES, STATUS } from "@/components/Upload/constants";
import { formatBytes, generateUUIDV4, shortenText } from "../../../utils/utils";
import { useMotifContext } from "../../motif/context/MotifProvider";

export const UploadContext = createContext<UploadContextType>(ContextDefaultValues);

export const UploadProvider = ({ children, props, isUploadInput, size = "md", name, disabled, value }: UploadProviderProps) => {
  const { maxFile = 1, autoUpload = true, messages, uploadRequest, deleteRequest, maxSize, accept, customValidation } = props;
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const activeRequestsRef = useRef<Set<XMLHttpRequest>>(new Set());
  const [selectedFiles, setSelectedFiles] = useState<FileType[]>(value ?? []);
  const { t } = useMotifContext();

  // Abort any in-flight requests left over when the provider unmounts, instead of
  // letting them keep running and later call setState on an unmounted component.
  useEffect(() => {
    const activeRequests = activeRequestsRef.current;
    return () => {
      activeRequests.forEach(request => request.abort());
      activeRequests.clear();
    };
  }, []);

  const selectedFilesEqualityString = selectedFiles.map(f => f.id + f.file.name + f.file.type + f.status).join(",");

  const _updateProgress = useCallback((fileIds: string[], e: ProgressEvent<XMLHttpRequestEventTarget>) => {
    // Some servers/proxies (chunked transfer-encoding, missing Content-Length) never make the
    // total computable. Skip those ticks instead of writing NaN/Infinity into progress, which
    // would freeze the progress bar even though the transfer is still moving.
    if (!e.lengthComputable || e.total === 0) return;
    const percentCompleted = Math.min(100, Math.max(0, Math.round((e.loaded / e.total) * 100)));
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
                messages: status === STATUS.SUCCESS ? [] : [messages?.uploadFailMessage || t(MESSAGE.UPLOAD_ERROR)],
                uploaded: status === STATUS.SUCCESS,
              },
        );
      });
    },
    [messages?.uploadFailMessage, t],
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
                messages: [messages?.uploadFailMessage || t(MESSAGE.UPLOAD_ERROR)],
              },
        ),
      );
    },
    [messages?.uploadFailMessage, t],
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

  const _transferStalled = useCallback(
    (fileIds: string[]) => {
      setSelectedFiles(prevState =>
        prevState.map(file =>
          !fileIds.includes(file.id)
            ? file
            : {
                ...file,
                status: STATUS.UPLOAD_FAIL,
                messages: [t(MESSAGE.UPLOAD_STALLED_ERROR)],
              },
        ),
      );
    },
    [t],
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
      activeRequestsRef.current.add(request);

      const stallTimeoutMs = uploadRequest.stallTimeout ?? DEFAULT_UPLOAD_STALL_TIMEOUT_MS;
      const stallState: { timer: ReturnType<typeof setTimeout> | undefined; stalled: boolean } = {
        timer: undefined,
        stalled: false,
      };
      const clearStallTimer = () => {
        if (stallState.timer) clearTimeout(stallState.timer);
        stallState.timer = undefined;
      };
      const armStallTimer = () => {
        clearStallTimer();
        stallState.timer = setTimeout(() => {
          stallState.stalled = true;
          request.abort();
        }, stallTimeoutMs);
      };

      const settle = (handler: () => void) => {
        clearStallTimer();
        activeRequestsRef.current.delete(request);
        handler();
      };
      request.addEventListener("load", () => settle(() => _transferComplete(fileIds, request)));
      request.addEventListener("error", () => settle(() => _transferFailed(fileIds)));
      request.addEventListener("abort", () => settle(() => (stallState.stalled ? _transferStalled(fileIds) : _transferAborted(fileIds))));
      request.upload.addEventListener("progress", e => {
        armStallTimer();
        _updateProgress(fileIds, e);
      });
      // Upload phase itself has finished (success or failure) — no more progress ticks will ever
      // arrive, so stop watching for them. From here we're just waiting on the server's response.
      request.upload.addEventListener("loadend", clearStallTimer);

      request.open(uploadRequest.method, uploadRequest.url);

      uploadRequest.headers?.forEach(item => {
        request.setRequestHeader(item.key, item.value);
      });

      const data = new FormData();
      if (bulk) {
        files.forEach(file => {
          data.append("file_" + file.id, file.file as File);
          data.append("fileId_" + file.id, file.id);
        });
      } else {
        data.append("file_" + files[0].id, files[0].file as File);
        data.append("fileId_" + files[0].id, files[0].id);
      }

      setSelectedFiles(prevState =>
        prevState.map(file => (!fileIds.includes(file.id) ? file : { ...file, status: STATUS.UPLOADING, request })),
      );

      // Arm before send() too, so a connection that never gets going (e.g. stuck in DNS/TLS
      // setup, no bytes ever leave the client) is also caught by the stall watchdog.
      armStallTimer();
      request.send(data);
    },
    [
      _transferAborted,
      _transferComplete,
      _transferFailed,
      _transferStalled,
      _updateProgress,
      deleteRequest.url,
      uploadRequest.headers,
      uploadRequest.method,
      uploadRequest.stallTimeout,
      uploadRequest.url,
    ],
  );

  const _deleteOnTheServerErrorHandler = useCallback(
    (filesToDelete: FileType[]) => {
      setSelectedFiles(prevState =>
        prevState.map(file =>
          filesToDelete.some(f => f.id === file.id)
            ? {
                ...file,
                status: STATUS.DELETE_FAIL,
                messages: [t(MESSAGE.DELETE_ERROR)],
              }
            : file,
        ),
      );
    },
    [t],
  );

  const _deleteFilesFromServer = useCallback(
    (filesToDelete: FileType[]) => {
      const request = new XMLHttpRequest();
      activeRequestsRef.current.add(request);
      const settle = (handler: () => void) => {
        activeRequestsRef.current.delete(request);
        handler();
      };

      request.addEventListener("load", () =>
        settle(() => {
          if (request.status === 200) {
            setSelectedFiles(prevState => prevState.filter(file => !filesToDelete.some(f => f.id === file.id)));
          } else {
            _deleteOnTheServerErrorHandler(filesToDelete);
          }
        }),
      );

      request.addEventListener("error", () => settle(() => _deleteOnTheServerErrorHandler(filesToDelete)));

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
    const { files: filesAfterVerification } = selectedFiles.reduce(
      (acc, f) => {
        // Uploading or uploaded files should not be checked again
        if (f.status === STATUS.UPLOADING || f.uploaded) {
          return { filesIteratedWithoutError: acc.filesIteratedWithoutError + 1, files: [...acc.files, f] };
        }

        const maxSizeError =
          maxSize &&
          f.file.size > maxSize &&
          (messages?.maxSizeMessage ??
            t(MESSAGE.MAX_SIZE_ERROR, {
              maxSize: formatBytes(maxSize),
              fileName: shortenText(f.file.name, 30),
              fileSize: formatBytes(f.file.size),
            }));

        // Mime Type Check
        const mimeTypeMessage =
          accept &&
          !accept.includes(MIME_TYPES.ALL) &&
          !accept.includes(f.file.type) &&
          (messages?.mimeTypeMessage ?? t(MESSAGE.MIME_TYPE, { acceptType: accept.toString(), fileType: f.file.type }));

        // Max File Check
        const maxFileError =
          maxFile && acc.filesIteratedWithoutError >= maxFile && (messages?.maxFileMessage ?? t(MESSAGE.MAX_FILE, { maxFile }));

        // Custom Validation
        const { errorMessage: customValidationError, isValid: customValidationValid } = customValidation?.(f.file as File) || {};
        const customValidationMessage =
          customValidationValid === false ? customValidationError || t(MESSAGE.CUSTOM_VALIDATION_ERROR) : undefined;

        const errors = [maxSizeError, maxFileError, mimeTypeMessage, customValidationMessage].filter(Boolean) as string[];

        return {
          filesIteratedWithoutError: errors.length ? acc.filesIteratedWithoutError : acc.filesIteratedWithoutError + 1,
          files: [
            ...acc.files,
            {
              ...f,
              ...(errors.length
                ? { status: STATUS.CHECK_FAIL, messages: errors }
                : { status: f.status === STATUS.CHECK_FAIL ? STATUS.IDLE : f.status }),
            },
          ],
        };
      },
      { filesIteratedWithoutError: 0, files: [] as FileType[] },
    );

    const anyChanged =
      filesAfterVerification.length !== selectedFiles.length || filesAfterVerification.some((f, i) => f !== selectedFiles[i]);

    anyChanged && setSelectedFiles(filesAfterVerification);

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

  // Re-translate stored error messages when locale changes
  useEffect(() => {
    setSelectedFiles(prev =>
      prev.map(f => {
        if (!f.messages?.length) return f;
        if (f.status === STATUS.UPLOAD_FAIL) {
          return { ...f, messages: [messages?.uploadFailMessage || t(MESSAGE.UPLOAD_ERROR)] };
        }
        if (f.status === STATUS.DELETE_FAIL) {
          return { ...f, messages: [t(MESSAGE.DELETE_ERROR)] };
        }
        return f;
      }),
    );
  }, [t, messages]);

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

const _isSameFile = (f1: File, f2: FileType) => f1.name === f2.file.name && f1.size === f2.file.size && f1.type === f2.file.type;
