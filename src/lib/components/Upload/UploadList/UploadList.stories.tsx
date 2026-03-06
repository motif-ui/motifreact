import type { Meta, StoryObj } from "@storybook/nextjs";
import UploadList from "@/components/Upload/UploadList";
import { MIME_TYPES } from "@/components/Upload/constants";

const url = "https://httpbin.org/post";
const method = "POST";

const meta: Meta<typeof UploadList> = {
  title: "Components/Upload List",
  component: UploadList,
  argTypes: {
    accept: { table: { defaultValue: { summary: MIME_TYPES.ALL } } },
    size: { table: { defaultValue: { summary: "md" } } },
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
type Story = StoryObj<typeof UploadList>;

export const Primary: Story = {};
