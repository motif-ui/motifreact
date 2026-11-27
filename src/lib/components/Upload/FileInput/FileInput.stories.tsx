import type { Meta, StoryObj } from "@storybook/nextjs";
import FileInput from "@/components/Upload/FileInput";
import { MIME_TYPES } from "@/components/Upload/constants";

const meta: Meta<typeof FileInput> = {
  title: "Components/File Input",
  component: FileInput,
  argTypes: {
    accept: { table: { defaultValue: { summary: MIME_TYPES.ALL } } },
    size: { table: { defaultValue: { summary: "md" } } },
    maxFile: { table: { defaultValue: { summary: "1" } } },
  },
};

export default meta;
type Story = StoryObj<typeof FileInput>;

export const Primary: Story = {};
