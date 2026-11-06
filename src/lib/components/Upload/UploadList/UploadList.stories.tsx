import type { Meta, StoryObj } from "@storybook/nextjs";
import UploadList from "@/components/Upload/UploadList";
import { MIME_TYPES } from "@/components/Upload/constants";
import { serverValidationRequest, serverValidationMswParameters, WithFakeUploadProgress } from "../docs/serverValidationStory";
import {
  downloadStoryParameters,
  fileActionStoryParameters,
  FilePreviewStory,
  sampleFiles,
  sampleFilesWithDownload,
} from "../docs/fileActionStory";

const url = "https://httpbun.com/post";
const method = "POST";

const meta: Meta<typeof UploadList> = {
  title: "Components/Upload List",
  component: UploadList,
  argTypes: {
    accept: { table: { defaultValue: { summary: MIME_TYPES.ALL } } },
    size: { table: { defaultValue: { summary: "md" } } },
    maxFile: { table: { defaultValue: { summary: "1" } } },
    fileAction: { table: { type: { summary: "{ icon: IconGlobalType; onClick: (file: FileValue) => void }" } } },
    autoUpload: { table: { defaultValue: { summary: "true" } } },
    value: {
      table: {
        type: {
          summary: "{ id: string; name: string; size: number; type: string; src?: string; onDownloadClick?: () => void; }[]",
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
type Story = StoryObj<typeof UploadList>;

export const Primary: Story = {};

export const ServerValidation: Story = {
  decorators: [WithFakeUploadProgress],
  parameters: serverValidationMswParameters,
  args: {
    uploadRequest: serverValidationRequest,
    deleteRequest: serverValidationRequest,
  },
};

export const WithDownload: Story = {
  parameters: downloadStoryParameters("UploadList"),
  args: {
    value: sampleFilesWithDownload,
  },
};

export const WithFileAction: Story = {
  parameters: fileActionStoryParameters("UploadList"),
  args: {
    accept: MIME_TYPES.IMAGE,
    value: sampleFiles,
  },
  render: args => <FilePreviewStory>{fileAction => <UploadList {...args} fileAction={fileAction} />}</FilePreviewStory>,
};
