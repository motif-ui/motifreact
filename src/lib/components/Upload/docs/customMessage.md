## Custom Messages

**messages** prop in this component allows the user to customize some messages. Those special messages may need some extra data related. In order to customize and show these messages properly, there are some string templating rules to follow for each type of message.

There are three types of messages with templates. Those messages and the parameters that need to be in the message template are stated below:

- maxFileMessage: **%maxFile%**
- maxSizeMessage: **%maxSize%**, **%fileSize%**, **%fileName%**
- mimeTypeMessage: **%acceptType%**, **%fileType%**

#### Examples

- **maxFileMessage:** _"Maximum %maxFile% files could be uploaded"_
  - "Maximum 3 files could be uploaded"
- **maxSizeMessage:** _"Maximum file size should be %maxSize% . Size of %fileName% is: %fileSize% "_
  - "Maximum file size should be 3.8 MB. Size of test.png is: 7.2 MB"
- **mimeTypeMessage:** _"Only %acceptType% types are allowed. Your file type is: %fileType%"_
  - "Only application/pdf types are allowed. Your file type is: image/jpeg"

## Custom Validation

The `customValidation` prop is a function that runs **synchronously** for each file and determines whether the file should be accepted or rejected.

### Type Definition

```ts
export type CustomValidation = {
  isValid: boolean;
  errorMessage: string;
};

export type UploadProps = {
  ...
  customValidation?: (file: File) => CustomValidation;
  ...
}
```

### How It Works

- Runs once **per file** when a user selects files to upload.
- Must return an object with the structure: **{ isValid: boolean, errorMessage: string }**.
- **Synchronous only** — no asynchronous logic (like fetching or file reading).
- If **isValid** is false, the file will be rejected and errorMessage will be shown to the user.
- If **customValidation** is not defined, all files are assumed to be valid.

#### Example

```tsx
import UploadList from "./UploadList";

<UploadList
  customValidation={(file: File) => {
    return {
      isValid: file.type === "application/pdf",
      errorMessage: "Only PDF files are allowed.",
    };
  }}
/>;
```

## Server Side Validation

Some validation can only happen on the server (virus scanning, content inspection, business rules that depend on data the
client doesn't have). This component surfaces those server-driven rejections directly in the file row, using the same
response the upload request already returns — no extra endpoint or polling is required.

### Type Definition

```ts
export type UploadServerResponse = {
  status: "success" | "fail";
  message?: string;
};
```

### How It Works

- Runs once the upload request settles, as soon as the server responds.
- If the HTTP response status is **not 200**, the component tries to parse the response body as JSON matching
  `UploadServerResponse`.
- If parsing succeeds, **status** is `"fail"`, and a **message** is present, that exact message is shown on the file row.
- If the body isn't valid JSON, doesn't match this shape, or has no message, the component falls back to
  `messages?.uploadFailMessage` (if provided) or the default upload error message — the same fallback used for a plain
  network/transport failure.
- A **200** response is always treated as a success; server-side rejection requires a non-200 status.

#### Example

A server rejecting a file should respond with a non-200 status and a body matching `UploadServerResponse`:

```ts
// Example API route
export const POST = async () => {
  return Response.json({ status: "fail", message: "Uploaded file is rejected by the server." }, { status: 500 });
};
```

```tsx
import UploadList from "./UploadList";

<UploadList
  uploadRequest={{ url: "/api/upload", method: "POST" }}
  deleteRequest={{ url: "/api/upload", method: "POST" }}
/>;
```

See the **Server Validation** story under Upload List, Upload Dragger, and Upload Input in Storybook for a live,
mocked example of this behavior.
