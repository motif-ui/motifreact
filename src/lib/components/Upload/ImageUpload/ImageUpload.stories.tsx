import type { Meta, StoryObj } from "@storybook/nextjs";
import ImageUpload from "@/components/Upload/ImageUpload/ImageUpload";

const url = "https://httpbin.org/post";
const method = "POST";

const meta: Meta<typeof ImageUpload> = {
  title: "Components/Image Upload",
  component: ImageUpload,
  argTypes: {
    size: { table: { defaultValue: { summary: "md" } } },
  },
  args: {
    uploadRequest: { url, method, headers: [{ key: "mtf", value: "ui" }] },
    deleteRequest: { url, method, headers: [{ key: "mtf", value: "ui" }] },
  },
};

export default meta;
type Story = StoryObj<typeof ImageUpload>;

export const Primary: Story = {};
