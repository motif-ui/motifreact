import { LocaleKey } from "../../../i18n/types";

export const STATUS = {
  IDLE: 0, // Validated and ready to upload
  UPLOADING: 1, // Uploading
  SUCCESS: 2, // Successfully uploaded
  CHECK_FAIL: 3, // Validation failed
  UPLOAD_FAIL: 4, // Upload failed
  ABORT: 5, // Aborted by user
  DELETE_FAIL: 6, // Delete failed
};

export const MESSAGE: Record<string, LocaleKey> = {
  MAX_SIZE_ERROR: "upload.maxSizeError",
  MAX_FILE: "upload.maxFileError",
  MIME_TYPE: "upload.mimeTypeError",
  UPLOAD_ERROR: "upload.uploadError",
  DELETE_ERROR: "upload.deleteError",
  PLEASE_DROP: "upload.pleaseDrop",
  PLEASE_CLICK_OR_DROP: "upload.pleaseClickOrDrop",
  FILES_BEING_UPLOADED: "upload.filesBeingUploaded",
  WAITING_TO_UPLOAD: "upload.waitingToUpload",
  UPLOAD_SUCCESS: "upload.uploadSuccess",
  DRAGGER_MAX_SIZE: "upload.draggerMaxSize",
  DRAGGER_MAX_FILE: "upload.draggerMaxFile",
  DRAGGER_CAN_UPLOAD_FILES: "upload.draggerCanUploadFiles",
  CUSTOM_VALIDATION_ERROR: "upload.customValidationError",
};

export const MIME_TYPES = {
  ALL: "*",
  WORD: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
    "application/vnd.ms-word.document.macroEnabled.12",
    "application/vnd.ms-word.template.macroEnabled.12",
  ],
  EXCEL: [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
    "application/vnd.ms-excel.sheet.macroEnabled.12",
    "application/vnd.ms-excel.template.macroEnabled.12",
    "application/vnd.ms-excel.addin.macroEnabled.12",
    "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
  ],
  POWERPOINT: [
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.openxmlformats-officedocument.presentationml.template",
    "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
    "application/vnd.ms-powerpoint.addin.macroEnabled.12",
    "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
    "application/vnd.ms-powerpoint.template.macroEnabled.12",
    "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
  ],
  IMAGE: [
    "image/gif",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/bmp",
    "image/x-ms-bmp",
    "image/tiff",
    "image/tiff-fx",
    "image/webp",
    "image/avif",
    "image/heic",
    "image/heif",
    "image/svg+xml",
  ],
  XML: ["application/xml", "text/xml"],
  PDF: "application/pdf",
  ZIP: ["application/x-zip-compressed", "application/zip"],
  RAR: ["application/x-rar-compressed", "application/x-rar"],
  TAR: ["application/x-tar"],
  GZ: ["application/x-compressed", "application/gzip"],
  CSV: ["text/csv"],
  OGG: ["audio/ogg"],
  BMP: ["image/bmp", "image/x-ms-bmp"],
  GIF: ["image/gif"],
  JPG: ["image/jpg"],
  JPEG: ["image/jpeg"],
  PNG: ["image/png"],
  TXT: ["text/plain"],
  HTML: ["text/html"],
  OCTET_STREAM: ["octet/stream", "application/octet-stream"],
  JSON: ["application/json"],
  TIFF: ["image/tiff", "image/tiff-fx"],
  KML: ["application/vnd.google-earth.kml+xml"],
  KMZ: ["application/vnd.google-earth.kmz"],
  EYP: ["application/octet-stream"],
  MP3: ["audio/mpeg"],
  SVG: ["image/svg+xml"],
  MP4: ["video/mp4"],
  WEBM: ["video/webm"],
  AVIF: ["image/avif"],
  HEIC: ["image/heic", "image/heif"],
};
