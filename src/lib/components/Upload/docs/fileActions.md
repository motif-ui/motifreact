## Initial Value

Files that already exist on the server are passed through the **value** prop. Each item is a `FileObject`, and the
component shows it as a successfully uploaded file.

### Type Definition

```ts
export type FileObject = {
  id: string; // Unique id of the file; used to match the file between renders
  name: string;
  size: number; // in bytes
  type: string; // MIME type, e.g. "image/jpeg"
  src?: string; // URL of the file; can be used by fileAction (e.g. to preview the file)
  onDownloadClick?: () => void; // Shows the download button when defined
};
```

#### Example

```tsx
import UploadList from "./UploadList";

<UploadList
  uploadRequest={{ url: "/api/upload", method: "POST" }}
  deleteRequest={{ url: "/api/delete", method: "POST" }}
  value={[{ id: "1", name: "photo.jpg", size: 245760, type: "image/jpeg", src: "/files/photo.jpg" }]}
/>;
```

## File Download

A download button is shown on a file row when its **value** item has an **onDownloadClick** function. The component
doesn't download anything on its own; it only calls **onDownloadClick**, so the download logic (direct link,
authenticated request, blob, etc.) is up to you.

### How It Works

- Only available for files given through **value**. Newly uploaded files don't have a download button, since the user
  already has the file.
- Stays visible if a delete request for the file fails.
- Disabled while a delete request for the file is in progress.
- Still shown when the component is **disabled** or **readOnly**.

#### Example

```tsx
import UploadList from "./UploadList";

const downloadFile = (src: string, name: string) => {
  const link = document.createElement("a");
  link.href = src;
  link.download = name;
  link.click();
};

<UploadList
  uploadRequest={{ url: "/api/upload", method: "POST" }}
  deleteRequest={{ url: "/api/delete", method: "POST" }}
  value={[
    {
      id: "1",
      name: "photo.jpg",
      size: 245760,
      type: "image/jpeg",
      onDownloadClick: () => downloadFile("/files/photo.jpg", "photo.jpg"),
    },
  ]}
/>;
```

## File Action

The **fileAction** prop adds a custom icon button to file rows.
It can be used for anything related to a single file, such as opening a preview, showing details or sharing it.

### Type Definition

```ts
export type FileAction = {
  icon: IconGlobalType; // Icon name or a custom icon element
  onClick: (file: FileValue) => void;
};

// The file given to onClick
export type FileValue = {
  id: string;
  file: Pick<File, "name" | "size" | "type">; // A real File instance for newly uploaded files
  status: number;
  uploaded?: boolean;
  progress?: number;
  messages?: string[];
  serverMessage?: string;
  src?: string; // Only for files given through value
  deleting?: boolean;
};

export type UploadProps = {
  ...
  fileAction?: FileAction;
  ...
}
```

### How It Works

- Works for both files from **value** and newly uploaded files.
- Shown while the file is on the server: after a successful upload, or after a failed delete request. It isn't shown
  while a file is waiting to upload or uploading, or after it has failed validation, failed to upload or been aborted.
- Disabled while a delete request for the file is in progress.
- Still shown when the component is **disabled** or **readOnly**.

#### Example

Opening an image in a modal:

```tsx
import { useState } from "react";
import UploadList from "./UploadList";
import Modal from "../../Modal";
import ImageView from "../../ImageView";
import useToggle from "../../../hooks/useToggle";
import { MIME_TYPES } from "../constants";
import { FileAction } from "../types";

const { visible, show, hide } = useToggle();
const [src, setSrc] = useState<string>();

const fileAction: FileAction = {
  icon: "visibility",
  onClick: file => {
    // value file → src, newly uploaded file → temporary URL from its File
    setSrc(file.src ?? URL.createObjectURL(file.file as File));
    show();
  },
};

return (
  <>
    <UploadList
      uploadRequest={{ url: "/api/upload", method: "POST" }}
      deleteRequest={{ url: "/api/delete", method: "POST" }}
      accept={MIME_TYPES.IMAGE}
      value={[{ id: "1", name: "photo.jpg", size: 245760, type: "image/jpeg", src: "/files/photo.jpg" }]}
      fileAction={fileAction}
    />
    <Modal open={visible} onClose={hide} closable>
      {src && <ImageView src={src} alt="File preview" width="100%" />}
    </Modal>
  </>
);
```

See the **With Download** and **With File Action** stories under Upload List, Upload Dragger, and Upload Input in
Storybook for live examples. In the **With File Action** story, you can also upload an image and preview it (in Upload
Input, delete the existing file first).
