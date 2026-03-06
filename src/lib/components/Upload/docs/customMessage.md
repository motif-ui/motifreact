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
