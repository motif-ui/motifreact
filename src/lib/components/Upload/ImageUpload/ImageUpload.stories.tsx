import type { Meta, StoryObj } from "@storybook/nextjs";
import ImageUpload from "@/components/Upload/ImageUpload/ImageUpload";

const url = "https://httpbin.org/post";
const method = "POST";

const meta: Meta<typeof ImageUpload> = {
  title: "Components/Image Upload",
  component: ImageUpload,
  argTypes: {
    size: { table: { defaultValue: { summary: "md" } } },
    value: {
      table: {
        type: { summary: "{ id: string; name: string; size: number; type: string; src?: string; onDownloadClick?: () => void; }[]" },
      },
    },
  },
  args: {
    uploadRequest: { url, method, headers: [{ key: "mtf", value: "ui" }] },
    deleteRequest: { url, method, headers: [{ key: "mtf", value: "ui" }] },
  },
};

export default meta;
type Story = StoryObj<typeof ImageUpload>;

export const Primary: Story = {};

export const WithDatabaseImage: Story = {
  args: {
    value: [
      {
        id: "db-1",
        name: "profile.jpg",
        size: 204800,
        type: "image/jpeg",
        src: "https://picsum.photos/200/300",
      },
    ],
    deleteRequest: { url: "https://httpbin.org/delete", method: "DELETE" },
  },
};
