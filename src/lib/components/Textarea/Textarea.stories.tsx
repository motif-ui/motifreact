import type { Meta, StoryObj } from "@storybook/nextjs";

import Textarea from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  argTypes: {
    value: { type: "string" },
    size: { table: { defaultValue: { summary: "md" } } },
    rows: { table: { defaultValue: { summary: "4" } }, control: { type: "number" } },
  },
  args: {
    placeholder: "Değer giriniz",
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Primary: Story = {};
