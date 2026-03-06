import type { Meta, StoryObj } from "@storybook/nextjs";
import UploadDragger from "@/components/Upload/UploadDragger";
import { MIME_TYPES } from "@/components/Upload/constants";

const url = "https://httpbin.org/post";
const method = "POST";

const meta: Meta<typeof UploadDragger> = {
  title: "Components/Upload Dragger",
  component: UploadDragger,
  argTypes: {
    accept: { table: { defaultValue: { summary: MIME_TYPES.ALL } } },
    maxFile: { table: { defaultValue: { summary: "1" } } },
    autoUpload: { table: { defaultValue: { summary: "true" } } },
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
