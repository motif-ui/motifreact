import type { Meta, StoryObj } from "@storybook/nextjs";
import UploadInput from "@/components/Upload/UploadInput";
import { MIME_TYPES } from "@/components/Upload/constants";
import { serverValidationRequest, serverValidationMswParameters, WithFakeUploadProgress } from "../docs/serverValidationStory";

const url = "https://httpbun.com/post";
const method = "POST";

const meta: Meta<typeof UploadInput> = {
  title: "Components/Upload Input",
  component: UploadInput,
  argTypes: {
    accept: { table: { defaultValue: { summary: MIME_TYPES.ALL } } },
    size: { table: { defaultValue: { summary: "md" } } },
    maxFile: { table: { defaultValue: { summary: "1" } } },
    autoUpload: { table: { defaultValue: { summary: "true" } } },
    value: { table: { type: { summary: "{ id: string; name: string; size: string; type: string; onDownloadClick?: () => void; }[]" } } },
  },
  args: {
    uploadRequest: { url, method, headers: [{ key: "mtf", value: "ui" }] },
    deleteRequest: { url, method, headers: [{ key: "mtf", value: "ui" }] },
    accept: [MIME_TYPES.ALL],
  },
};

export default meta;
type Story = StoryObj<typeof UploadInput>;

export const Primary: Story = {};

export const ServerValidation: Story = {
  decorators: [WithFakeUploadProgress],
  parameters: serverValidationMswParameters,
  args: {
    uploadRequest: serverValidationRequest,
    deleteRequest: serverValidationRequest,
  },
};
