import type { Meta, StoryObj } from "@storybook/nextjs";

import InputText from "./InputText";

const meta: Meta<typeof InputText> = {
  title: "Components/InputText",
  component: InputText,
  argTypes: {
    value: { type: "string" },
    size: { table: { defaultValue: { summary: "md" } } },
  },
  args: {
    iconLeft: "folder",
    placeholder: "Placeholder",
  },
};

export default meta;
type Story = StoryObj<typeof InputText>;

export const Primary: Story = {};
