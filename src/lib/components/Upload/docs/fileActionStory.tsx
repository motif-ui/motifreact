import { ReactNode, useState } from "react";
import Modal from "@/components/Modal";
import ImageView from "@/components/ImageView";
import useToggle from "../../../hooks/useToggle";
import { FileAction, FileObject } from "@/components/Upload/types.ts";

const SAMPLE_PICSUM = {
  id: "sample-picsum",
  name: "picsum-1015.jpg",
  size: 177113,
  type: "image/jpeg",
  src: "https://picsum.photos/id/1015/1200/800",
};

/**
 * Already uploaded files, as they would come from the server.
 */
export const sampleFiles: FileObject[] = [SAMPLE_PICSUM];

export const sampleFilesWithDownload: FileObject[] = [
  { ...SAMPLE_PICSUM, onDownloadClick: () => alert(`onDownloadClick: ${SAMPLE_PICSUM.name}`) },
];

type FilePreviewStoryProps = {
  children: (fileAction: FileAction) => ReactNode;
};

/**
 * Renders the upload component given in `children` with a `fileAction` that opens the image in a modal.
 */
export const FilePreviewStory = ({ children }: FilePreviewStoryProps) => {
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

/**
 * Source of the given story file, so the shown code always matches the story.
 */
const fileSource = (f: FileObject) =>
  `{ id: "${f.id}", name: "${f.name}", size: ${f.size}, type: "${f.type}", src: "${f.src}"` +
  (f.onDownloadClick ? `, onDownloadClick: () => alert("onDownloadClick: ${f.name}")` : "") +
  " }";

export const downloadStoryParameters = (componentName: string) => ({
  docs: {
    source: {
      language: "tsx",
      code: `
<${componentName}
  uploadRequest={{ url: "/api/upload", method: "POST" }}
  deleteRequest={{ url: "/api/delete", method: "POST" }}
  value={[
    ${fileSource(sampleFilesWithDownload[0])},
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
        ${fileSource(sampleFiles[0])},
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
