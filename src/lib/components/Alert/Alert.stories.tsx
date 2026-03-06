import type { Meta, StoryObj } from "@storybook/nextjs";

import Alert from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  argTypes: {
    variant: { table: { defaultValue: { summary: "secondary" } } },
  },
  args: {
    title: "Uyarı Başlığı",
    message: "Bu bir test mesajıdır.",
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Primary: Story = {};
