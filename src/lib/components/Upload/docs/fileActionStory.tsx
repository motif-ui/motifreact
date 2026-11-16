import { ReactNode, useState } from "react";
import Modal from "@/components/Modal";
import ImageView from "@/components/ImageView";
import useToggle from "../../../hooks/useToggle";
import { FileAction, FileObject } from "@/components/Upload/types.ts";

/**
 * An already uploaded file, as it would come from the server.
 */
export const SAMPLE_FILE: FileObject = {
  id: "sample-picsum",
  name: "picsum-1015.jpg",
  size: 177113,
  type: "image/jpeg",
  src: "https://picsum.photos/id/1015/1200/800",
};

export const SAMPLE_FILE_WITH_DOWNLOAD: FileObject = {
  ...SAMPLE_FILE,
  onDownloadClick: () => alert(`onDownloadClick: ${SAMPLE_FILE.name}`),
};

/**
 * Renders the upload component given in `children` with a `fileAction` that opens the image in a modal.
 */
export const FilePreviewStory = ({ children }: { children: (fileAction: FileAction) => ReactNode }) => {
  const { visible, show, hide } = useToggle();
  const [src, setSrc] = useState<string>();

  const fileAction: FileAction = {
    icon: "visibility",
    onClick: file => {
      setSrc(file.src);
      show();
    },
  };

  return (
    <>
      {children(fileAction)}
      <Modal open={visible} onClose={hide} closable>
        {src && <ImageView src={src} alt="File preview" width="100%" />}
      </Modal>
    </>
  );
};

export const downloadStoryParameters = (componentName: string) => ({
  docs: {
    source: {
      language: "tsx",
      code: `
<${componentName}
  uploadRequest={{ url: "/api/upload", method: "POST" }}
  deleteRequest={{ url: "/api/delete", method: "POST" }}
  value={[
    {
      id: "sample-picsum",
      name: "picsum-1015.jpg",
      size: 177113,
      type: "image/jpeg",
      src: "https://picsum.photos/id/1015/1200/800",
      onDownloadClick: () => alert("onDownloadClick: picsum-1015.jpg"),
    },
  ]}
/>`,
    },
  },
});

export const fileActionStoryParameters = (componentName: string) => ({
  docs: {
    source: {
      language: "tsx",
      code: `
const { visible, show, hide } = useToggle();
const [src, setSrc] = useState<string>();

const fileAction = {
  icon: "visibility",
  onClick: file => {
    setSrc(file.src);
    show();
  },
};

return (
  <>
    <${componentName}
      uploadRequest={{ url: "/api/upload", method: "POST" }}
      deleteRequest={{ url: "/api/delete", method: "POST" }}
      value={[
        {
          id: "sample-picsum",
          name: "picsum-1015.jpg",
          size: 177113,
          type: "image/jpeg",
          src: "https://picsum.photos/id/1015/1200/800",
        },
      ]}
      fileAction={fileAction}
    />
    <Modal open={visible} onClose={hide} closable>
      <ImageView src={src} alt="File preview" width="100%" />
    </Modal>
  </>
);`,
    },
  },
});
