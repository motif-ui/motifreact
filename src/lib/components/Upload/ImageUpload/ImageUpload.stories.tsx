import type { Meta, StoryObj } from "@storybook/nextjs";
import ImageUpload from "@/components/Upload/ImageUpload/ImageUpload";

const url = "https://httpbun.com/post";
const method = "POST";

const meta: Meta<typeof ImageUpload> = {
  title: "Components/Image Upload",
  component: ImageUpload,
  argTypes: {
    size: { table: { defaultValue: { summary: "md" } } },
    value: {
      control: { type: "boolean" },
      mapping: {
        false: undefined,
        true: {
          id: "db-1",
          name: "profile.jpg",
          size: 204800,
          type: "image/jpeg",
          src: "https://picsum.photos/300/300",
        },
      },
      table: {
        type: { summary: "{ id: string; name: string; size: number; type: string; src?: string; onDownloadClick?: () => void; }" },
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
