import type { Meta, StoryObj } from "@storybook/nextjs";
import UploadDragger from "@/components/Upload/UploadDragger";
import { MIME_TYPES } from "@/components/Upload/constants";
import { serverValidationRequest, serverValidationMswParameters, WithFakeUploadProgress } from "../docs/serverValidationStory";

const url = "https://httpbun.com/post";
const method = "POST";

const meta: Meta<typeof UploadDragger> = {
  title: "Components/Upload Dragger",
  component: UploadDragger,
  argTypes: {
    accept: { table: { defaultValue: { summary: MIME_TYPES.ALL } } },
    maxFile: { table: { defaultValue: { summary: "1" } } },
    autoUpload: { table: { defaultValue: { summary: "true" } } },
    value: {
      table: {
        type: {
          summary:
            "{ id: string; name: string; size: string; type: string; onDownloadClick?: () => void; action?: { icon?: IconGlobalType; onClick: () => void }; }[]",
        },
      },
    },
  },
  args: {
    uploadRequest: { url, method, headers: [{ key: "mtf", value: "ui" }] },
    deleteRequest: { url, method, headers: [{ key: "mtf", value: "ui" }] },
    accept: [MIME_TYPES.ALL],
  },
};

export default meta;
type Story = StoryObj<typeof UploadDragger>;

export const Primary: Story = {};

export const ServerValidation: Story = {
  decorators: [WithFakeUploadProgress],
  parameters: serverValidationMswParameters,
  args: {
    uploadRequest: serverValidationRequest,
    deleteRequest: serverValidationRequest,
  },
};

export const WithActionAndDownload: Story = {
  args: {
    maxFile: 3,
    actionIcon: "visibility",
    value: [
      {
        id: "file-1",
        name: "sozlesme.pdf",
        size: 2048,
        type: "application/pdf",
        onDownloadClick: () => console.log("Download clicked for sozlesme.pdf"),
        action: { onClick: () => console.log("Action clicked for sozlesme.pdf") },
      },
      {
        id: "file-2",
        name: "fatura.pdf",
        size: 4096,
        type: "application/pdf",
        onDownloadClick: () => console.log("Download clicked for fatura.pdf"),
        action: { onClick: () => console.log("Action clicked for fatura.pdf") },
      },
      {
        id: "file-3",
        name: "gorsel.png",
        size: 8192,
        type: "image/png",
        onDownloadClick: () => console.log("Download clicked for gorsel.png"),
        action: { onClick: () => console.log("Action clicked for gorsel.png") },
      },
    ],
  },
};
